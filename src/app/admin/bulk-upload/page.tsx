'use client';

import React, { useReducer, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import { checkHardLimits } from '@/lib/csv-validator';
import { runDryRun, commitIngestion } from './actions';
import type { DryRunRow, IngestionStats } from '@/types/ingestion';

type Mode = 'cards' | 'sets';

type IngestionState =
  | { status: 'idle'; mode: Mode; error?: string }
  | { status: 'file-selected'; file: File; mode: Mode; error?: string }
  | { status: 'dry-running'; file: File; mode: Mode }
  | { status: 'preview'; rows: DryRunRow[]; stats: IngestionStats; mode: Mode; file: File; originalData: any[] }
  | { status: 'critical-error'; missingSets: string[]; file: File; mode: Mode }
  | { status: 'confirm-modal'; rows: DryRunRow[]; stats: IngestionStats; mode: Mode; file: File; originalData: any[] }
  | { status: 'committing'; stats: IngestionStats }
  | { status: 'success'; stats: IngestionStats }
  | { status: 'error-fatal'; message: string };

type IngestionAction =
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'FILE_DROP'; file: File; mode: Mode }
  | { type: 'HARD_LIMIT_ERROR'; message: string }
  | { type: 'DRY_RUN_START' }
  | { type: 'DRY_RUN_SUCCESS'; rows: DryRunRow[]; stats: IngestionStats; originalData: any[] }
  | { type: 'DRY_RUN_CRITICAL'; missingSets: string[] }
  | { type: 'COMMIT_CLICK' }
  | { type: 'COMMIT_CANCEL' }
  | { type: 'COMMIT_START' }
  | { type: 'COMMIT_SUCCESS'; stats: IngestionStats }
  | { type: 'COMMIT_FAIL'; message: string }
  | { type: 'DRY_RUN_EMPTY'; message: string }
  | { type: 'RESET' };

function ingestionReducer(state: IngestionState, action: IngestionAction): IngestionState {
  switch (action.type) {
    case 'SET_MODE':
      if (state.status !== 'idle' && state.status !== 'file-selected' && state.status !== 'critical-error') return state;
      return { status: 'idle', mode: action.mode };
    case 'FILE_DROP':
      return { status: 'file-selected', file: action.file, mode: action.mode };
    case 'HARD_LIMIT_ERROR':
      return { status: 'idle', mode: state.status === 'error-fatal' ? 'cards' : (state as any).mode || 'cards', error: action.message };
    case 'DRY_RUN_START':
      if (state.status !== 'file-selected') return state;
      return { ...state, status: 'dry-running' };
    case 'DRY_RUN_SUCCESS':
      if (state.status !== 'dry-running') return state;
      return { status: 'preview', rows: action.rows, stats: action.stats, mode: state.mode, file: state.file, originalData: action.originalData };
    case 'DRY_RUN_CRITICAL':
      if (state.status !== 'dry-running') return state;
      return { status: 'critical-error', missingSets: action.missingSets, file: state.file, mode: state.mode };
    case 'COMMIT_CLICK':
      if (state.status !== 'preview') return state;
      return { ...state, status: 'confirm-modal' };
    case 'COMMIT_CANCEL':
      if (state.status !== 'confirm-modal') return state;
      return { ...state, status: 'preview' };
    case 'COMMIT_START':
      if (state.status !== 'confirm-modal') return state;
      return { status: 'committing', stats: state.stats };
    case 'COMMIT_SUCCESS':
      return { status: 'success', stats: action.stats };
    case 'COMMIT_FAIL':
      return { status: 'error-fatal', message: action.message };
    case 'DRY_RUN_EMPTY':
      if (state.status !== 'dry-running') return state;
      return { status: 'file-selected', file: state.file, mode: state.mode, error: action.message };
    case 'RESET':
      return { status: 'idle', mode: (state as any).mode || 'cards' };
    default:
      return state;
  }
}

export default function BulkUploadPage() {
  const [state, dispatch] = useReducer(ingestionReducer, { status: 'idle', mode: 'cards' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileSelect = useCallback((file: File) => {
    // Basic row count estimation by newlines (naive but fast for initial check)
    // Actual accurate count happens in PapaParse
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(l => l.trim() !== '').length - 1;
      const limitError = checkHardLimits(rows, file.size, state.status === 'idle' || state.status === 'file-selected' || state.status === 'dry-running' || state.status === 'preview' || state.status === 'critical-error' ? state.mode : 'cards');
      
      if (limitError) {
        dispatch({ type: 'HARD_LIMIT_ERROR', message: limitError });
      } else {
        dispatch({ type: 'FILE_DROP', file, mode: (state as any).mode || 'cards' });
      }
    };
    reader.readAsText(file);
  }, [state]);

  const handleRunDryRun = async () => {
    if (state.status !== 'file-selected') return;

    dispatch({ type: 'DRY_RUN_START' });

    try {
      const text = await state.file.text();
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: h => h.trim()
      });

      if (result.data.length === 0) {
        dispatch({ type: 'DRY_RUN_EMPTY', message: 'Empty file — no data rows found' });
        return;
      }

      // Detect header mismatch
      const headers = result.meta.fields || [];
      if (state.mode === 'cards' && headers.includes('code') && !headers.includes('card_number')) {
        dispatch({ type: 'HARD_LIMIT_ERROR', message: 'Wrong file: this looks like a sets.csv. Switch to "Import Sets" mode.' });
        return;
      }
      if (state.mode === 'sets' && headers.includes('card_number') && !headers.includes('code')) {
        dispatch({ type: 'HARD_LIMIT_ERROR', message: 'Wrong file: this looks like a cards.csv. Switch to "Import Cards" mode.' });
        return;
      }

      const response = await runDryRun(result.data as Array<Record<string, string>>, state.mode);

      if (response.result === 'critical-error') {
        dispatch({ type: 'DRY_RUN_CRITICAL', missingSets: response.missingSets });
      } else {
        dispatch({ type: 'DRY_RUN_SUCCESS', rows: response.rows, stats: response.stats, originalData: result.data });
      }
    } catch (err: any) {
      dispatch({ type: 'COMMIT_FAIL', message: err.message });
    }
  };

  const handleCommit = async () => {
    if (state.status !== 'confirm-modal') return;

    const { rows, mode, originalData, stats } = state;
    dispatch({ type: 'COMMIT_START' });

    try {
      const response = await commitIngestion(rows, mode, originalData);
      if (response.success) {
        dispatch({ type: 'COMMIT_SUCCESS', stats });
      } else {
        const committedInfo = response.committed > 0
          ? ` (${response.committed} rows already committed to database)`
          : '';
        dispatch({ type: 'COMMIT_FAIL', message: response.errors.join(', ') + committedInfo });
      }
    } catch (err: any) {
      dispatch({ type: 'COMMIT_FAIL', message: err.message });
    }
  };

  const isIdle = state.status === 'idle';
  const isFileSelected = state.status === 'file-selected';
  const isDryRunning = state.status === 'dry-running';
  const isPreview = state.status === 'preview';
  const isCriticalError = state.status === 'critical-error';
  const isConfirmModal = state.status === 'confirm-modal';
  const isCommitting = state.status === 'committing';
  const isSuccess = state.status === 'success';
  const isFatalError = state.status === 'error-fatal';

  const mode = (state as any).mode || 'cards';

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Bulk Ingester
        </h1>
        <p className="text-white/60">Upload card or set data via CSV to update the ArkaDex database.</p>
      </header>

      {/* Mode Selector */}
      <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl w-fit mb-8">
        <button
          data-testid="mode-cards"
          onClick={() => dispatch({ type: 'SET_MODE', mode: 'cards' })}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            mode === 'cards' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Import Cards
        </button>
        <button
          data-testid="mode-sets"
          onClick={() => dispatch({ type: 'SET_MODE', mode: 'sets' })}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            mode === 'sets' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Import Sets
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Upload Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">
          {(isIdle || isFileSelected || isDryRunning) && (
            <div 
              data-testid="dropzone"
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-12 px-4 transition-all cursor-pointer relative group ${
                isFileSelected ? 'border-green-500/50 bg-green-500/5' : 'border-white/20 hover:border-purple-500/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.name.endsWith('.csv')) onFileSelect(file);
              }}
            >
              <input 
                type="file" 
                accept=".csv" 
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
                className="hidden"
              />
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                isFileSelected ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/10 text-purple-400'
              }`}>
                {isFileSelected ? (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                )}
              </div>
              <p className="text-lg font-medium">
                {isFileSelected ? (state as any).file.name : 'Drop your CSV file here'}
              </p>
              <p className="text-sm text-white/40">
                {isFileSelected ? `${((state as any).file.size / 1024).toFixed(1)} KB` : 'Only .csv files up to 5MB'}
              </p>

              {(isIdle || isFileSelected) && (state as any).error && (
                <p data-testid="hard-limit-error" className="mt-4 text-red-400 text-sm font-medium animate-pulse">{(state as any).error}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-4">
              <button
                data-testid="btn-run-dry-run"
                disabled={!isFileSelected || isDryRunning}
                onClick={handleRunDryRun}
                className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  !isFileSelected || isDryRunning
                    ? 'bg-white/10 text-white/20 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {isDryRunning && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                {isDryRunning ? 'Processing...' : 'Run Dry-Run'}
              </button>
            </div>

            <button
              data-testid="btn-commit"
              disabled={!isPreview || (state as any).stats.errorCount === (state as any).stats.total}
              onClick={() => dispatch({ type: 'COMMIT_CLICK' })}
              className={`px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-purple-500/20 ${
                !isPreview || (state as any).stats.errorCount === (state as any).stats.total
                  ? 'bg-white/10 text-white/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 active:scale-95 text-white'
              }`}
            >
              Commit Ingestion
            </button>
          </div>

          {/* Dry Run Preview Section */}
          <AnimatePresence>
            {isCriticalError && (
              <motion.div 
                data-testid="critical-error-banner"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-8 bg-red-500/10 border border-red-500/20 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-1">Critical Error: Missing Sets</h3>
                    <p className="text-white/60 text-sm mb-4">
                      The following set codes found in your CSV do not exist in the database. 
                      Please import these sets first or fix the CSV.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {state.missingSets.map(s => (
                        <span key={s} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-mono">{s}</span>
                      ))}
                    </div>
                    <button 
                      data-testid="btn-switch-to-sets"
                      onClick={() => dispatch({ type: 'SET_MODE', mode: 'sets' })}
                      className="mt-6 text-sm font-bold text-white hover:underline flex items-center gap-2"
                    >
                      Switch to Import Sets →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {isPreview && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 space-y-8"
              >
                {/* Stats Panel */}
                <div 
                  data-testid="stats-panel"
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{state.stats.total}</div>
                    <div className="text-xs text-white/40 uppercase tracking-widest">Rows</div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{state.stats.newCount}</div>
                    <div className="text-xs text-green-400/40 uppercase tracking-widest">New</div>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{state.stats.overwriteCount}</div>
                    <div className="text-xs text-blue-400/40 uppercase tracking-widest">Overwrite</div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">{state.stats.errorCount}</div>
                    <div className="text-xs text-red-400/40 uppercase tracking-widest">Errors</div>
                  </div>
                </div>

                {state.stats.errorCount > 0 && (
                  <div data-testid="warning-banner" className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-amber-200/80">
                      Found {state.stats.errorCount} rows with validation errors. These rows will be skipped during ingestion.
                    </p>
                  </div>
                )}

                {/* Preview Table */}
                <div 
                  data-testid="preview-table"
                  className="overflow-x-auto border border-white/10 rounded-xl"
                >
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-xs text-white/40 uppercase tracking-widest">
                      <tr>
                        <th className="px-4 py-3 font-medium">Row</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Set/Code</th>
                        <th className="px-4 py-3 font-medium">Name/Number</th>
                        <th className="px-4 py-3 font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                      {state.rows.slice(0, 20).map((row) => (
                        <tr key={row.rowIndex} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3 font-mono text-white/40">{row.rowIndex}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.status === 'NEW' ? 'bg-green-500/20 text-green-400' :
                              row.status === 'OVERWRITE' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium">{row.setCode}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span>{row.name}</span>
                              <span className="text-xs text-white/40">{row.cardNumber}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {row.errors ? (
                              <ul className="text-xs text-red-400 list-disc list-inside">
                                {row.errors.map((e, idx) => <li key={idx}>{e}</li>)}
                              </ul>
                            ) : (
                              <span className="text-xs text-white/20 italic">Validated</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {state.rows.length > 20 && (
                    <div className="p-4 text-center text-xs text-white/20 border-t border-white/5">
                      Showing first 20 of {state.rows.length} rows...
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch({ type: 'COMMIT_CANCEL' })}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              data-testid="confirm-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-4">Confirm Ingestion</h2>
              <p className="text-white/60 mb-6">
                You are about to process <span className="text-white font-bold">{state.stats.total - state.stats.errorCount}</span> valid rows. 
                Existing entries will be overwritten. This action cannot be undone.
              </p>

              <div className="bg-white/5 rounded-xl p-4 mb-8 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Mode:</span>
                  <span className="font-bold uppercase">{state.mode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Success/Overwrite:</span>
                  <span className="font-bold text-green-400">{state.stats.newCount + state.stats.overwriteCount}</span>
                </div>
                <div className="flex justify-between text-sm text-red-400">
                  <span className="text-white/40">Skipped (Errors):</span>
                  <span>{state.stats.errorCount}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  data-testid="btn-cancel-commit"
                  onClick={() => dispatch({ type: 'COMMIT_CANCEL' })}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  data-testid="btn-confirm-commit"
                  onClick={handleCommit}
                  className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                >
                  Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success/Error Panels */}
      <AnimatePresence>
        {isCommitting && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-8" />
            <h2 className="text-3xl font-bold mb-2">Committing Data...</h2>
            <p className="text-white/40">Processing chunks and updating database. Please do not close this window.</p>
          </div>
        )}

        {isSuccess && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-4">
            <motion.div 
              data-testid="success-panel"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-12 max-w-lg w-full"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mx-auto mb-8">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-green-400">Success!</h2>
              <p className="text-white/60 mb-8">
                Successfully ingested <span className="text-white font-bold">{state.stats.newCount + state.stats.overwriteCount}</span> rows into the database.
              </p>
              <button 
                onClick={() => dispatch({ type: 'RESET' })}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all"
              >
                Start New Upload
              </button>
            </motion.div>
          </div>
        )}

        {isFatalError && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-4">
            <motion.div 
              data-testid="fatal-error-panel"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-12 max-w-lg w-full"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-8">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-red-400">Ingestion Failed</h2>
              <p className="text-red-400/60 mb-8">{state.message}</p>
              <button 
                onClick={() => dispatch({ type: 'RESET' })}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all"
              >
                Go Back
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
