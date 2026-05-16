'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerSupabase } from '@/lib/supabase-server';
import { validateCardRow, validateSetRow } from '@/lib/csv-validator';
import type { DryRunRow, IngestionStats, DryRunStatus } from '@/types/ingestion';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function assertAdmin(): Promise<void> {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const whitelist = (process.env.ADMIN_EMAIL_WHITELIST ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isAuthorized = user && whitelist.includes((user.email ?? '').toLowerCase());

  if (!isAuthorized) {
    throw new Error('Unauthorized');
  }
}

/**
 * Runs dry-run validation and detection
 */
export async function runDryRun(
  parsedRows: Array<Record<string, string>>,
  mode: 'cards' | 'sets'
): Promise<
  | { result: 'ok'; rows: DryRunRow[]; stats: IngestionStats }
  | { result: 'critical-error'; missingSets: string[] }
> {
  await assertAdmin();
  const rows: DryRunRow[] = [];
  const stats: IngestionStats = {
    total: parsedRows.length,
    newCount: 0,
    overwriteCount: 0,
    errorCount: 0,
  };

  if (mode === 'cards') {
    // 1. Extract unique set codes
    const uniqueSetCodes = [...new Set(parsedRows.map(r => r.set_code).filter(Boolean))];
    
    // 2. Query valid sets
    const { data: validSets, error: setErrors } = await supabaseAdmin
      .from('sets')
      .select('id, code')
      .in('code', uniqueSetCodes);

    if (setErrors) throw setErrors;

    const setCodeToId = Object.fromEntries(validSets?.map(s => [s.code, s.id]) || []);
    const missingSets = uniqueSetCodes.filter(c => !setCodeToId[c]);

    // 3. Handle critical error (unknown sets)
    if (missingSets.length > 0) {
      return { result: 'critical-error', missingSets };
    }

    // 4. Detected existing cards for OVERWRITE check
    const pairs = parsedRows
      .filter(r => r.set_code && r.card_number)
      .map(r => ({ set_id: setCodeToId[r.set_code], card_number: r.card_number }));

    // Optimization: query all existing cards in this batch
    // Supabase JS doesn't support complex composite IN, so we use a RPC or raw filter if many
    // For 500 rows, we can just fetch and filter or use a custom filter string
    const { data: existingCards } = await supabaseAdmin
      .from('cards')
      .select('set_id, card_number')
      .in('set_id', Object.values(setCodeToId));

    const existingKeySet = new Set(existingCards?.map(c => `${c.set_id}:${c.card_number}`) || []);
    const inBatchSeen = new Map<string, number>(); // key → first rowIndex

    // 5. Process rows
    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      const rowIndex = i + 1;
      const errors = validateCardRow(row, rowIndex);

      const batchKey = `${row.set_code}:${row.card_number}`;
      if (inBatchSeen.has(batchKey)) {
        errors.push(`Row ${rowIndex}: duplicate of row ${inBatchSeen.get(batchKey)} in this batch.`);
      } else {
        inBatchSeen.set(batchKey, rowIndex);
      }

      let status: DryRunStatus = 'NEW';
      const setId = setCodeToId[row.set_code];
      const dbKey = `${setId}:${row.card_number}`;

      if (errors.length > 0) {
        status = 'ERROR';
        stats.errorCount++;
      } else if (existingKeySet.has(dbKey)) {
        status = 'OVERWRITE';
        stats.overwriteCount++;
      } else {
        status = 'NEW';
        stats.newCount++;
      }

      rows.push({
        rowIndex,
        status,
        setCode: row.set_code,
        cardNumber: row.card_number,
        name: row.card_name,
        rarity: row.rarity,
        errors: errors.length > 0 ? errors : undefined,
      });
    }
  } else {
    // Sets mode
    const { data: existingSets } = await supabaseAdmin.from('sets').select('code');
    const existingCodes = new Set(existingSets?.map(s => s.code) || []);
    const inBatchSeen = new Map<string, number>();

    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      const rowIndex = i + 1;
      const errors = validateSetRow(row, rowIndex);

      if (inBatchSeen.has(row.code)) {
        errors.push(`Row ${rowIndex}: duplicate of row ${inBatchSeen.get(row.code)} in this batch.`);
      } else {
        inBatchSeen.set(row.code, rowIndex);
      }

      let status: DryRunStatus = 'NEW';
      if (errors.length > 0) {
        status = 'ERROR';
        stats.errorCount++;
      } else if (existingCodes.has(row.code)) {
        status = 'OVERWRITE';
        stats.overwriteCount++;
      } else {
        status = 'NEW';
        stats.newCount++;
      }

      rows.push({
        rowIndex,
        status,
        setCode: row.code,
        name: row.name,
        errors: errors.length > 0 ? errors : undefined,
      });
    }
  }

  return { result: 'ok', rows, stats };
}

/**
 * Commits the ingestion to database
 */
export async function commitIngestion(
  rows: DryRunRow[],
  mode: 'cards' | 'sets',
  originalData: Array<Record<string, string>>
): Promise<{ success: boolean; committed: number; errors: string[] }> {
  await assertAdmin();
  const errors: string[] = [];
  let committed = 0;

  // Filter out error rows
  const validIndices = rows
    .filter(r => r.status !== 'ERROR')
    .map(r => r.rowIndex - 1);
  
  const dataToCommit = validIndices.map(idx => originalData[idx]);

  if (mode === 'cards') {
    const uniqueCodes = [...new Set(dataToCommit.map(r => r.set_code))];
    const { data: sets } = await supabaseAdmin.from('sets').select('id, code').in('code', uniqueCodes);
    const codeToId = Object.fromEntries(sets?.map(s => [s.code, s.id]) || []);

    const formattedCards = dataToCommit.map(r => ({
      set_id: codeToId[r.set_code],
      card_number: r.card_number,
      name: r.card_name,
      rarity: r.rarity || null,
      supertype: r.supertype || null,
      element: r.element || null,
      image_url: r.image_url || null,
    }));

    // Chunked upsert
    const CHUNK_SIZE = 100;
    for (let i = 0; i < formattedCards.length; i += CHUNK_SIZE) {
      const chunk = formattedCards.slice(i, i + CHUNK_SIZE);
      const { error } = await supabaseAdmin
        .from('cards')
        .upsert(chunk, { onConflict: 'set_id,card_number' });
      
      if (error) {
        errors.push(`Chunk ${Math.floor(i / CHUNK_SIZE) + 1} failed: ${error.message}`);
      } else {
        committed += chunk.length;
      }
    }

    // Update total_cards in sets
    if (committed > 0) {
      for (const setId of Object.values(codeToId)) {
        try {
          const { count } = await supabaseAdmin
            .from('cards')
            .select('*', { count: 'exact', head: true })
            .eq('set_id', setId);

          const { error: updateError } = await supabaseAdmin
            .from('sets')
            .update({ total_cards: count })
            .eq('id', setId);

          if (updateError) {
            errors.push(`total_cards update failed for set ${setId}: ${updateError.message}`);
          }
        } catch (e: any) {
          errors.push(`total_cards update failed for set ${setId}: ${e.message}`);
        }
      }
    }
  } else {
    const formattedSets = dataToCommit.map(r => ({
      code: r.code,
      name: r.name,
      release_date: r.release_date || null,
      total_cards: r.total_cards ? parseInt(r.total_cards) : 0,
    }));

    const CHUNK_SIZE = 100;
    for (let i = 0; i < formattedSets.length; i += CHUNK_SIZE) {
      const chunk = formattedSets.slice(i, i + CHUNK_SIZE);
      const { error } = await supabaseAdmin
        .from('sets')
        .upsert(chunk, { onConflict: 'code' });
      
      if (error) {
        errors.push(`Chunk ${Math.floor(i / CHUNK_SIZE) + 1} failed: ${error.message}`);
      } else {
        committed += chunk.length;
      }
    }
  }

  return { success: errors.length === 0, committed, errors };
}
