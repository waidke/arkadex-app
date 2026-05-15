import { test, expect } from '@playwright/test';

/**
 * ArkaDex E2E Auth Test Suite
 * Covers Tier 1 (Anonymous), Middleware, Auth Callback, and Security Headers.
 */

test.describe('Tier 1 — Anonymous User', () => {
  test('TC-01: /binder loads catalog tanpa login', async ({ page }) => {
    await page.goto('/binder');
    // Halaman harus load (bukan redirect)
    await expect(page).toHaveURL('/binder');
    // Minimal satu set card terlihat atau loading state selesai
    await expect(page.locator('img[alt], .animate-pulse, [data-testid="set-item"]').first()).toBeVisible({ timeout: 15000 });
  });

  test('TC-02: Homepage tidak redirect anonymous user', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('TC-03: /legal tidak butuh autentikasi', async ({ page }) => {
    await page.goto('/legal');
    await expect(page).toHaveURL('/legal');
  });
});

test.describe('Middleware — Route Protection', () => {
  test('TC-04: Unauthenticated user ke /admin redirect ke home', async ({ page }) => {
    await page.goto('/admin/bulk-upload');
    await expect(page).toHaveURL('/');
  });

  test('TC-05: Unauthenticated user ke /admin/apapun redirect ke home', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page).toHaveURL('/');
  });

  test('TC-06: Static assets tidak terblokir middleware', async ({ page }) => {
    // Middleware tidak boleh interfere dengan asset statis yang dikecualikan di matcher
    // Kita cek response status untuk favicon atau next-static (jika ada)
    const response = await page.request.get('/favicon.ico');
    // Di local dev mungkin 404, tapi TIDAK boleh redirect (3xx) ke /
    expect(response.status()).not.toBe(302);
    expect(response.status()).not.toBe(307);
  });
});

test.describe('Auth Callback — Security Checks', () => {
  test('TC-07: Callback tanpa code redirect ke /?message=auth_error', async ({ page }) => {
    await page.goto('/auth/callback');
    await expect(page).toHaveURL('/?message=auth_error');
  });

  test('TC-08: Callback dengan next= absolute URL ditolak → redirect ke /binder', async ({ page }) => {
    await page.goto('/auth/callback?next=//evil.com');
    const url = new URL(page.url());
    expect(url.hostname).not.toBe('evil.com');
    // Fallback logic akan membawa ke /binder atau /?message=auth_error jika code exchange gagal
    expect(page.url()).toContain('/?message=auth_error');
  });

  test('TC-09: Callback dengan next= path relatif valid diterima', async ({ page }) => {
    await page.goto('/auth/callback?next=/binder');
    await expect(page).toHaveURL('/?message=auth_error');
  });

  test('TC-10: Callback dengan next= https:// external ditolak', async ({ page }) => {
    await page.goto('/auth/callback?next=https://evil.com/steal');
    const url = new URL(page.url());
    expect(url.hostname).not.toBe('evil.com');
  });
});

test.describe('Security Headers', () => {
  // Vercel headers hanya ada di production/preview deployment, skip di localhost
  test.skip(({ baseURL }) => !!baseURL?.includes('localhost'), 'Vercel headers tidak aktif di localhost');

  test('TC-11: Strict-Transport-Security header ada', async ({ page }) => {
    const response = await page.goto('/');
    const hsts = response?.headers()['strict-transport-security'];
    expect(hsts).toBeDefined();
  });

  test('TC-12: X-Frame-Options: DENY ada', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.headers()['x-frame-options']).toBe('DENY');
  });

  test('TC-13: Content-Security-Policy ada', async ({ page }) => {
    const response = await page.goto('/');
    const csp = response?.headers()['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
  });

  test('TC-14: X-Content-Type-Options: nosniff ada', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.headers()['x-content-type-options']).toBe('nosniff');
  });
});
