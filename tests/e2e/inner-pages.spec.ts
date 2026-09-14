import { test, expect } from '@playwright/test';

for (const route of ['/books','/books/little-lambs-christian-activity-book','/our-story','/about','/contact','/cart','/checkout','/account','/login','/register']) {
  test(`${route} has a readable responsive layout`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('h1').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(32);
    expect(await page.locator('.inner-canvas svg').evaluateAll(els => els.every(el => el.getBoundingClientRect().width <= 64))).toBe(true);
  });
}
test('book browsing and accessible cover preview', async ({ page }) => {
  await page.goto('/books');
  await page.getByRole('link', { name: 'Explore Book Details' }).click();
  await page.getByRole('button', { name: 'Enlarge cover' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Enlarge cover' })).toBeFocused();
});
test('enquiry prepares a draft without claiming delivery', async ({ page }) => {
  await page.goto('/contact');
  await page.getByLabel('Your Full Name').fill('Test Reader');
  await page.getByLabel('Email Address', { exact: true }).fill('reader@example.com');
  await page.getByLabel('Subject', { exact: true }).fill('Book enquiry');
  await page.getByLabel('Message', { exact: true }).fill('Please share ordering details.');
  await page.getByRole('button', { name: 'Prepare email' }).click();
  await expect(page.getByRole('status')).toContainText('Nothing has been sent');
  await expect(page.getByRole('link', { name: 'Open email draft' })).toHaveAttribute('href', /^mailto:atmabooks@gmail.com\?subject=Book%20enquiry/);
  await page.getByText('Can I pay online?', { exact: true }).click();
  await expect(page.getByText('Online ordering is not available yet. Please enquire before making any payment.')).toBeVisible();
});
