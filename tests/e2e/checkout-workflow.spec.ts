import { test, expect } from '@playwright/test';
import { setupTestInventory, cleanupTestInventory } from '../helpers/testDb';

test.describe('Checkout + Orders + Manual UPI E2E Suite', () => {
  let testBookId: string;

  test.beforeEach(async () => {
    // Setup isolated test book with stock = 5
    const book = await setupTestInventory(5);
    testBookId = book.id;
  });

  test.afterEach(async () => {
    await cleanupTestInventory();
  });

  test('complete customer checkout flow: add to cart, address selection, order placement, UTR submission', async ({ page }) => {
    const timestamp = Date.now();
    const userEmail = `e2e_checkout_${timestamp}@example.com`;
    const password = 'Password123!';

    // 1. Register customer
    await page.goto('/register');
    await page.fill('#reg-name', 'E2E Checkout Customer');
    await page.fill('#reg-email', userEmail);
    await page.fill('#reg-password', password);
    await page.fill('#reg-confirm-password', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/login\?registered=true/);

    // 2. Sign in
    await page.fill('#login-email', userEmail);
    await page.fill('#login-password', password);
    await page.click('button[type="submit"]');

    await page.waitForURL('/account', { timeout: 15000 });

    // 3. Add item to cart
    await page.goto('/books/little-lambs-christian-activity-book');
    await page.click('button:has-text("Add to Cart")');
    await expect(page).toHaveURL(/.*\/cart/);

    // 4. Proceed to Checkout
    await page.click('a:has-text("Proceed to Checkout")');
    await expect(page).toHaveURL(/.*\/checkout/);

    // 5. Fill delivery address
    await page.fill('input[style*="width: 100%"]', 'E2E Checkout Customer');
    const inputs = page.locator('form input');
    await inputs.nth(0).fill('E2E Checkout Customer');
    await inputs.nth(1).fill('9876543210');
    await inputs.nth(2).fill('77 Cathedral Road');
    await inputs.nth(4).fill('Kochi');
    await inputs.nth(5).fill('Kerala');
    await inputs.nth(6).fill('682001');

    await page.click('button:has-text("Save & Use Address")');

    // 6. Place Order
    await page.click('button:has-text("Place Order & Pay via UPI")');

    // 7. Verify redirection to Order Detail page
    await page.waitForURL(/\/account\/orders\/LL-2026-/);
    const url = page.url();
    expect(url).toContain('/account/orders/LL-2026-');

    // 8. Verify order details page elements
    await expect(page.locator('h2')).toContainText(/Order LL-2026-/);
    await expect(page.locator('text=Payment Details & Instructions')).toBeVisible();
    await expect(page.locator('text=Pay via Manual UPI QR')).toBeVisible();
    await expect(page.locator('text=77 Cathedral Road')).toBeVisible();

    // 9. Submit UTR transaction reference
    await page.fill('#utr-input', 'UTR849201749201');
    await page.click('button:has-text("Submit Payment Reference")');

    await expect(page.locator('text=Payment Reference Submitted!')).toBeVisible();
    await expect(page.locator('text=VERIFICATION PENDING')).toBeVisible();

    // 10. Verify order appears in Customer Order History (/account/orders)
    await page.goto('/account/orders');
    await expect(page.locator('h2')).toContainText('Order History');
    await expect(page.locator('text=VERIFICATION PENDING')).toBeVisible();
  });
});
