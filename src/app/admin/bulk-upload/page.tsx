'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface ParsedCard {
  set_code: string;
  card_number: string;
  card_name: string;
  rarity: string;
  supertype: string;
  element?: string;
  image_url?: string;
}

interface IngestionLog {
  status: 'success' | 'error' | 'pending';
  message: string;
  timestamp: string;
}

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<IngestionLog[]>([]);
  const [stats, setStats] = useState({ total: 0, success: 0, error: 0 });

  const addLog = (message: string, status: 'success' | 'error' | 'pending' = 'pending') => {
    setLogs(prev => [{ status, message, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  };

  const parseCSV = (text: string): ParsedCard[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values = line.split(',');
        const card: any = {};
        headers.forEach((header, index) => {
          card[header] = values[index]?.trim();
        });
        return card as ParsedCard;
      });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      addLog(`File selected: ${e.target.files[0].name}`, 'success');
    }
  };

  const processIngestion = async () => {
    if (!file) return;
    
    setLoading(true);
    setLogs([]);
    setStats({ total: 0, success: 0, error: 0 });
    
    try {
      addLog('Reading file...', 'pending');
      const text = await file.text();
      const rawData = parseCSV(text);
      setStats(prev => ({ ...prev, total: rawData.length }));
      addLog(`Parsed ${rawData.length} rows. Starting ingestion...`, 'success');

      // Group by set_code to minimize set lookups
      const setGroups = rawData.reduce((acc, card) => {
        if (!acc[card.set_code]) acc[card.set_code] = [];
        acc[card.set_code].push(card);
        return acc;
      }, {} as Record<string, ParsedCard[]>);

      let totalSuccess = 0;
      let totalError = 0;

      for (const [set_code, cards] of Object.entries(setGroups)) {
        addLog(`Processing set: ${set_code}...`, 'pending');
        
        // 1. Find set_id
        const { data: setData, error: setError } = await supabase
          .from('sets')
          .select('id')
          .eq('code', set_code)
          .single();

        if (setError || !setData) {
          addLog(`Error finding set ${set_code}: ${setError?.message || 'Set not found'}`, 'error');
          totalError += cards.length;
          continue;
        }

        const set_id = setData.id;
        addLog(`Set ${set_code} found (ID: ${set_id.substring(0, 8)}...). Uploading ${cards.length} cards...`, 'pending');

        // 2. Format for Supabase
        const formattedCards = cards.map(c => ({
          set_id,
          name: c.card_name,
          card_number: c.card_number,
          rarity: c.rarity,
          supertype: c.supertype,
          element: c.element || null,
          image_url: c.image_url || null
        }));

        // 3. Upsert to Supabase
        const { error: upsertError } = await supabase
          .from('cards')
          .upsert(formattedCards, { onConflict: 'set_id, card_number' });

        if (upsertError) {
          addLog(`Error upserting cards for ${set_code}: ${upsertError.message}`, 'error');
          totalError += cards.length;
        } else {
          addLog(`Successfully ingested ${cards.length} cards for ${set_code}.`, 'success');
          totalSuccess += cards.length;
        }
        
        setStats(prev => ({ ...prev, success: totalSuccess, error: totalError }));
      }

      addLog('Ingestion complete.', 'success');
    } catch (err: any) {
      addLog(`Critical Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Bulk Ingester</h1>
        <p className="text-white/60">Upload card data via CSV to update the ArkaDex database.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl py-12 px-4 hover:border-purple-500/50 transition-colors cursor-pointer relative group">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-lg font-medium">{file ? file.name : 'Drop your CSV file here'}</p>
              <p className="text-sm text-white/40">Supported format: .csv only</p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs text-white/40 uppercase tracking-tighter">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.success}</div>
                  <div className="text-xs text-white/40 uppercase tracking-tighter">Success</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{stats.error}</div>
                  <div className="text-xs text-white/40 uppercase tracking-tighter">Errors</div>
                </div>
              </div>
              
              <button
                onClick={processIngestion}
                disabled={!file || loading}
                className={`px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-purple-500/20 ${
                  !file || loading 
                    ? 'bg-white/10 text-white/20 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 active:scale-95'
                }`}
              >
                {loading ? 'Processing...' : 'Run Ingestion'}
              </button>
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 h-80 flex flex-col">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Process Logs</h3>
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm custom-scrollbar">
              <AnimatePresence initial={false}>
                {logs.length === 0 ? (
                  <p className="text-white/20 italic">No activity yet...</p>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-3 ${
                        log.status === 'success' ? 'text-green-400' : 
                        log.status === 'error' ? 'text-red-400' : 'text-blue-400'
                      }`}
                    >
                      <span className="opacity-40">[{log.timestamp}]</span>
                      <span>{log.message}</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Reference */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold mb-4">Requirements</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 text-[10px]">1</div>
                <p className="text-white/60">Headers must match: <code className="text-white">set_code, card_number, card_name, rarity, supertype, element, image_url</code></p>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 text-[10px]">2</div>
                <p className="text-white/60">Set code must exist in the <code className="text-white">sets</code> table first.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 text-[10px]">3</div>
                <p className="text-white/60">Supertype must be: <code className="text-white">Pokemon, Trainer, Energy</code></p>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold mb-2">Need help?</h3>
            <p className="text-sm text-white/60 mb-4">Download the CSV template or check the documentation for data formatting rules.</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
              Download Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
