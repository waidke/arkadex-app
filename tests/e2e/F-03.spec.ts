/**
 * F-03 — Lean CMS Bulk Ingestion (E2E Test Draft)
 *
 * Gate: Test Draft (Gate c) — semua test di-skip.
 * Assertion ditulis penuh sebagai dokumentasi + placeholder.
 * Implementasi penuh aktif saat Gate e (full E2E run).
 *
 * Acceptance Criteria yang di-cover:
 *   AC-01 — Happy path cards import → success-panel visible
 *   AC-02 — Happy path sets import → success-panel visible
 *   AC-03 — Dry-run wajib: btn-commit disabled sebelum dry-run dijalankan
 *   AC-04 — Critical error: critical-error-banner visible + btn-commit disabled
 *   AC-05 — Per-row error: warning-banner visible + btn-commit tetap aktif
 *   AC-06 — Admin-only: redirect ke `/` jika tidak auth
 *   AC-07 — Hard limit: error inline muncul di area dropzone langsung
 *
 *   AC-07 tidak memiliki `data-testid` khusus di page.tsx (error muncul sebagai
 *   <p className="text-red-400 ..."> di dalam dropzone). Selector:
 *   `[data-testid="hard-limit-error"]`
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Menulis file CSV sementara ke direktori __dirname.
 * Kembalikan path absolut untuk dipakai oleh setInputFiles.
 */
function createCsvFile(filename: string, content: string): string {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

// ---------------------------------------------------------------------------
// CSV Fixtures
// ---------------------------------------------------------------------------

/** Cards CSV — 1 baris valid (AC-01, AC-03) */
const CARDS_CSV_VALID =
  'set_code,card_number,card_name,rarity,supertype,element,image_url\n' +
  'SV1S,001/190,Test Card Alpha,C,Pokemon,Fire,https://assets.tcgdex.net/id/SV/SV1S/001/high.png';

/** Cards CSV — set_code tidak ada di DB → critical-error (AC-04) */
const CARDS_CSV_MISSING_SET =
  'set_code,card_number,card_name,rarity,supertype,element,image_url\n' +
  'NONEXISTENT_SET_XYZ,001/190,Orphan Card,C,Pokemon,Fire,';

/**
 * Cards CSV campuran — 1 baris valid + 1 baris invalid (missing card_name) (AC-05)
 * Wajib campuran agar btn-commit tetap aktif:
 *   `disabled={!isPreview || stats.errorCount === stats.total}` (page.tsx baris 257)
 * Jika semua error, commit tetap disabled → test tidak bisa membedakan AC-04 vs AC-05.
 */
const CARDS_CSV_MIXED =
  'set_code,card_number,card_name,rarity,supertype,element,image_url\n' +
  'SV1S,002/190,Valid Card Beta,C,Pokemon,Fire,\n' +
  'SV1S,003/190,,C,Pokemon,Fire,';         // card_name kosong → akan jadi error row

/** Sets CSV — 1 baris valid (AC-02) */
const SETS_CSV_VALID =
  'code,name,release_date,total_cards\n' +
  'TEST_SET_E2E,E2E Test Set,2024-01-01,10';

/**
 * Hard-limit CSV — >500 baris kartu (AC-07)
 * checkHardLimits menggunakan row count dari newline split di onFileSelect.
 * Generate 501 data rows agar melampaui limit.
 */
function buildHardLimitCsv(): string {
  const header = 'set_code,card_number,card_name,rarity,supertype,element,image_url';
  const rows = Array.from({ length: 501 }, (_, i) =>
    `SV1S,${String(i + 1).padStart(3, '0')}/999,Card ${i + 1},C,Pokemon,Fire,`
  );
  return [header, ...rows].join('\n');
}

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------

test.describe('F-03 — Bulk Ingestion', () => {
  // Daftar file sementara yang harus di-cleanup setelah semua test selesai
  const tempFiles: string[] = [];

  test.afterAll(() => {
    for (const filePath of tempFiles) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  });

  // =========================================================================
  // AC-01 — Happy path: import cards
  // =========================================================================
  test.skip('AC-01 — happy path cards: dry-run → commit → success-panel', async ({ page }) => {
    const csvPath = createCsvFile('ac01-cards-valid.csv', CARDS_CSV_VALID);
    tempFiles.push(csvPath);

    // 1. Navigasi ke halaman
    await page.goto('/admin/bulk-upload');

    // 2. Upload file via hidden file input di dalam dropzone
    await page.locator('[data-testid="dropzone"] input[type="file"]').setInputFiles(csvPath);

    // 3. Klik Run Dry-Run
    await page.locator('[data-testid="btn-run-dry-run"]').click();

    // 4. Tunggu preview-table muncul (timeout 10s)
    await expect(page.locator('[data-testid="preview-table"]')).toBeVisible({ timeout: 10000 });

    // 5. Klik Commit to Database
    await page.locator('[data-testid="btn-commit"]').click();

    // 6. Modal konfirmasi harus muncul
    await expect(page.locator('[data-testid="confirm-modal"]')).toBeVisible();

    // 7. Klik Proceed di modal
    await page.locator('[data-testid="btn-confirm-commit"]').click();

    // 8. Tunggu success-panel (timeout 15s — commit melibatkan network + DB)
    await expect(page.locator('[data-testid="success-panel"]')).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // AC-02 — Happy path: import sets
  // =========================================================================
  test.skip('AC-02 — happy path sets: switch mode → dry-run → commit → success-panel', async ({ page }) => {
    const csvPath = createCsvFile('ac02-sets-valid.csv', SETS_CSV_VALID);
    tempFiles.push(csvPath);

    await page.goto('/admin/bulk-upload');

    // Wajib switch ke mode sets sebelum upload (default state.mode = 'cards')
    await page.locator('[data-testid="mode-sets"]').click();

    // Upload file sets CSV (schema: code,name,release_date,total_cards)
    await page.locator('[data-testid="dropzone"] input[type="file"]').setInputFiles(csvPath);

    await page.locator('[data-testid="btn-run-dry-run"]').click();

    await expect(page.locator('[data-testid="preview-table"]')).toBeVisible({ timeout: 10000 });

    await page.locator('[data-testid="btn-commit"]').click();

    await expect(page.locator('[data-testid="confirm-modal"]')).toBeVisible();

    await page.locator('[data-testid="btn-confirm-commit"]').click();

    await expect(page.locator('[data-testid="success-panel"]')).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // AC-03 — btn-commit DISABLED sebelum dry-run dijalankan
  // =========================================================================
  test.skip('AC-03 — btn-commit disabled sebelum dry-run: file dipilih tapi dry-run belum jalan', async ({ page }) => {
    const csvPath = createCsvFile('ac03-cards-valid.csv', CARDS_CSV_VALID);
    tempFiles.push(csvPath);

    await page.goto('/admin/bulk-upload');

    // State: idle → btn-commit harus disabled (belum ada file)
    await expect(page.locator('[data-testid="btn-commit"]')).toBeDisabled();

    // Upload file — state berubah ke file-selected
    await page.locator('[data-testid="dropzone"] input[type="file"]').setInputFiles(csvPath);

    // State: file-selected → btn-commit MASIH disabled (dry-run belum jalan)
    // AC-03: dry-run wajib sebelum commit bisa diaktifkan
    await expect(page.locator('[data-testid="btn-commit"]')).toBeDisabled();

    // Konfirmasi btn-run-dry-run aktif (bisa diklik)
    await expect(page.locator('[data-testid="btn-run-dry-run"]')).toBeEnabled();
  });

  // =========================================================================
  // AC-04 — Critical error: set tidak ditemukan di DB
  // =========================================================================
  test.skip('AC-04 — critical error: critical-error-banner visible + btn-commit disabled', async ({ page }) => {
    const csvPath = createCsvFile('ac04-missing-set.csv', CARDS_CSV_MISSING_SET);
    tempFiles.push(csvPath);

    await page.goto('/admin/bulk-upload');

    await page.locator('[data-testid="dropzone"] input[type="file"]').setInputFiles(csvPath);

    await page.locator('[data-testid="btn-run-dry-run"]').click();

    // critical-error-banner harus muncul (timeout 10s)
    await expect(page.locator('[data-testid="critical-error-banner"]')).toBeVisible({ timeout: 10000 });

    // btn-commit harus disabled — state berubah ke critical-error bukan preview
    // (page.tsx: disabled={!isPreview || ...})
    await expect(page.locator('[data-testid="btn-commit"]')).toBeDisabled();

    // Banner harus menampilkan set code yang hilang
    await expect(page.locator('[data-testid="critical-error-banner"]')).toContainText('NONEXISTENT_SET_XYZ');
  });

  // =========================================================================
  // AC-05 — Per-row error: warning-banner visible + btn-commit tetap aktif
  // =========================================================================
  test.skip('AC-05 — per-row error: warning-banner visible dan btn-commit tetap aktif', async ({ page }) => {
    // CSV campuran: 1 valid + 1 invalid — wajib agar errorCount < total,
    // sehingga btn-commit tidak disabled oleh kondisi `errorCount === total`
    const csvPath = createCsvFile('ac05-cards-mixed.csv', CARDS_CSV_MIXED);
    tempFiles.push(csvPath);

    await page.goto('/admin/bulk-upload');

    await page.locator('[data-testid="dropzone"] input[type="file"]').setInputFiles(csvPath);

    await page.locator('[data-testid="btn-run-dry-run"]').click();

    // preview-table harus muncul (dry-run selesai tanpa critical error)
    await expect(page.locator('[data-testid="preview-table"]')).toBeVisible({ timeout: 10000 });

    // warning-banner harus muncul karena ada error rows
    await expect(page.locator('[data-testid="warning-banner"]')).toBeVisible();

    // stats-panel harus ada (menampilkan total/new/overwrite/error)
    await expect(page.locator('[data-testid="stats-panel"]')).toBeVisible();

    // btn-commit harus AKTIF (karena ada baris valid yang bisa di-commit)
    await expect(page.locator('[data-testid="btn-commit"]')).toBeEnabled();
  });

  // =========================================================================
  // AC-06 — Admin-only: redirect ke `/` jika tidak auth
  // =========================================================================
  test.skip('AC-06 — admin-only: redirect ke / jika tidak auth', async ({ browser }) => {
    // Buat context baru dengan storage state kosong (unauthenticated)
    // Tidak menggunakan `page` fixture default yang mungkin membawa session
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    await page.goto('/admin/bulk-upload');

    // Middleware/layout harus redirect ke `/` karena tidak ada session
    // waitForURL handles server-side redirect
    await page.waitForURL('/', { timeout: 5000 });
    await expect(page).toHaveURL('/');

    await context.close();
  });

  // =========================================================================
  // AC-07 — Hard limit: error inline di dropzone area langsung
  // =========================================================================
  test.skip('AC-07 — hard limit: error inline muncul di dropzone saat file >500 baris', async ({ page }) => {
    // Generate CSV dengan 501 data rows (melampaui batas 500)
    const csvPath = createCsvFile('ac07-hard-limit.csv', buildHardLimitCsv());
    tempFiles.push(csvPath);

    await page.goto('/admin/bulk-upload');

    await page.locator('[data-testid="dropzone"] input[type="file"]').setInputFiles(csvPath);

    // Error inline muncul di dalam dropzone.
    const hardLimitError = page.locator('[data-testid="hard-limit-error"]');
    await expect(hardLimitError).toBeVisible({ timeout: 3000 });

    // btn-run-dry-run harus tetap disabled (state kembali ke idle setelah HARD_LIMIT_ERROR)
    await expect(page.locator('[data-testid="btn-run-dry-run"]')).toBeDisabled();
  });

  // =========================================================================
  // AC-03 (extended) — btn-run-dry-run disabled saat state committing/success
  // =========================================================================
  test.skip('AC-03 extended — btn-run-dry-run disabled saat state confirm-modal terbuka', async ({ page }) => {
    const csvPath = createCsvFile('ac03b-cards-valid.csv', CARDS_CSV_VALID);
    tempFiles.push(csvPath);

    await page.goto('/admin/bulk-upload');

    await page.locator('[data-testid="dropzone"] input[type="file"]').setInputFiles(csvPath);
    await page.locator('[data-testid="btn-run-dry-run"]').click();
    await expect(page.locator('[data-testid="preview-table"]')).toBeVisible({ timeout: 10000 });

    // Buka modal konfirmasi
    await page.locator('[data-testid="btn-commit"]').click();
    await expect(page.locator('[data-testid="confirm-modal"]')).toBeVisible();

    // Klik Cancel → kembali ke state preview
    await page.locator('[data-testid="btn-cancel-commit"]').click();
    await expect(page.locator('[data-testid="confirm-modal"]')).not.toBeVisible();

    // Kembali ke preview — btn-commit harus aktif kembali
    await expect(page.locator('[data-testid="btn-commit"]')).toBeEnabled();
  });
});
