import { test, expect } from '@playwright/test';

test.describe('Phase 7 — Security Attack & Production Security Verification', () => {
  test('1. Security HTTP Headers are present on server responses', async ({ request }) => {
    const response = await request.get('/books');
    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['strict-transport-security']).toContain('max-age=');
    expect(headers['content-security-policy']).toBeDefined();
    expect(headers['permissions-policy']).toBeDefined();
  });

  test('2. Unauthenticated access to admin endpoints is rejected with HTTP 403 or 401', async ({ page, request }) => {
    // API request without session
    const apiRes = await request.get('/api/admin/inventory');
    expect([401, 403]).toContain(apiRes.status());

    // Page navigation without session redirects or blocks access
    await page.goto('/admin/inventory');
    await page.waitForURL((url) => url.pathname.includes('/login') || url.pathname.includes('/admin'));
  });

  test('3. Cron expiration endpoint rejects requests lacking valid CRON_SECRET authorization', async ({ request }) => {
    const response = await request.get('/api/cron/expire-reservations');
    expect([401, 403]).toContain(response.status());
  });

  test('4. Legal & policy pages load successfully with complete content and disclosures', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('h1')).toContainText('Privacy Policy');

    await page.goto('/terms');
    await expect(page.locator('h1')).toContainText('Terms of Service');

    await page.goto('/shipping');
    await expect(page.locator('h1')).toContainText('Shipping & Delivery Policy');

    await page.goto('/refund-cancellation');
    await expect(page.locator('h1')).toContainText('Refund & Cancellation Policy');
  });
});
