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
    await page.waitForLoadState('networkidle');
    await page.fill('#reg-name', 'E2E Checkout Customer');
    await page.fill('#reg-email', userEmail);
    await page.fill('#reg-password', password);
    await page.fill('#reg-confirm-password', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/login\?registered=true/, { timeout: 10000 });

    // 2. Sign in
    await page.fill('#login-email', userEmail);
    await page.fill('#login-password', password);
    await page.click('button[type="submit"]');

    await page.waitForURL('/account', { timeout: 15000 });

    // 3. Add item to cart
    await page.goto('/books/little-lambs-activity-book');
    await page.click('button:has-text("Add to Cart")');
    await page.waitForTimeout(1000);
    await page.goto('/cart');
    await expect(page).toHaveURL(/.*\/cart/);

    // 4. Proceed to Checkout
    await page.click('button:has-text("Proceed to Checkout")');
    await expect(page).toHaveURL(/.*\/checkout/);

    // 5. Fill delivery address
    await page.fill('#address-fullname', 'E2E Checkout Customer');
    await page.fill('#address-phone', '9876543210');
    await page.fill('#address-line1', '77 Cathedral Road');
    await page.fill('#address-city', 'Kochi');
    await page.fill('#address-state', 'Kerala');
    await page.fill('#address-pincode', '682001');

    await page.click('button:has-text("Save Address")');
    await expect(page.locator('.address-card')).toBeVisible({ timeout: 10000 });

    // 6. Place Order
    await expect(page.locator('button:has-text("Place Order")')).toBeEnabled({ timeout: 10000 });
    await page.click('button:has-text("Place Order")');

    // 7. Verify redirection to Order Detail page
    await page.waitForURL(/\/account\/orders\/(ORD|LL)-/);
    const url = page.url();
    expect(url).toContain('/account/orders/');

    // 8. Verify order details page elements
    await expect(page.locator('h2')).toContainText(/Order (ORD|LL)-/);
    await expect(page.locator('text=Order Items')).toBeVisible();
    await expect(page.locator('text=Complete Payment via Manual UPI')).toBeVisible();
    await expect(page.locator('text=77 Cathedral Road')).toBeVisible();

    // 9. Submit UTR transaction reference
    const utrRef = `UTR${timestamp}`;
    await page.fill('#utr-input', utrRef);
    await page.click('button:has-text("Submit Payment Reference")');

    await expect(page.locator('text=Payment Reference Submitted!')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=VERIFICATION PENDING').first()).toBeVisible({ timeout: 10000 });

    // 10. Verify order appears in Customer Order History (/account/orders)
    await page.goto('/account/orders');
    await expect(page.locator('h2')).toContainText('Order History');
    await expect(page.locator('text=VERIFICATION PENDING').first()).toBeVisible({ timeout: 10000 });
  });
});
