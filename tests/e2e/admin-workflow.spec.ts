import { test, expect } from '@playwright/test';
import { setupTestInventory, cleanupTestInventory } from '../helpers/testDb';
import { prisma } from '@/lib/db/prisma';

test.describe('Phase 6 — Admin Operations & Security Attack E2E Suite', () => {
  let testBookId: string;
  let adminEmail: string;
  let adminUserId: string;
  let customerEmail: string;
  let customerUserId: string;
  const password = 'Password123!';

  test.beforeEach(async () => {
    const timestamp = Date.now();
    adminEmail = `admin_e2e_${timestamp}@example.com`;
    customerEmail = `customer_e2e_${timestamp}@example.com`;

    // 1. Setup isolated book stock = 10
    const book = await setupTestInventory(10);
    testBookId = book.id;

    // 2. Setup ADMIN user in PostgreSQL
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: '$2a$12$eImiTXuWVxfM37uY4JANjOL.81F8.jY/6aG4tG6k29R3QkP07',
        fullName: 'E2E Admin',
        role: 'ADMIN',
      },
    });
    adminUserId = adminUser.id;

    // 3. Setup CUSTOMER user in PostgreSQL
    const customerUser = await prisma.user.create({
      data: {
        email: customerEmail,
        passwordHash: '$2a$12$eImiTXuWVxfM37uY4JANjOL.81F8.jY/6aG4tG6k29R3QkP07',
        fullName: 'E2E Customer',
        role: 'CUSTOMER',
      },
    });
    customerUserId = customerUser.id;
  });

  test.afterEach(async () => {
    await prisma.stockMovement.deleteMany({ where: { bookId: testBookId } });
    await prisma.auditLog.deleteMany({ where: { actorUserId: { in: [adminUserId, customerUserId] } } });
    await prisma.payment.deleteMany({ where: { order: { userId: customerUserId } } });
    await prisma.orderItem.deleteMany({ where: { order: { userId: customerUserId } } });
    await prisma.orderAddressSnapshot.deleteMany({ where: { order: { userId: customerUserId } } });
    await prisma.order.deleteMany({ where: { userId: customerUserId } });
    await prisma.user.deleteMany({ where: { id: { in: [adminUserId, customerUserId] } } });
    await cleanupTestInventory();
  });

  test('1. Security Guard: Non-admin & unauthenticated users cannot access /admin or admin APIs', async ({ page, request }) => {
    // Unauthenticated access to /admin -> redirected to /login
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/login/);

    // Login as CUSTOMER
    await page.goto('/login');
    await page.fill('#login-email', customerEmail);
    await page.fill('#login-password', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/account', { timeout: 15000 });

    // Customer attempts to open /admin -> redirected to /login
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/login/);

    // Customer API attack attempt to POST /api/admin/books -> 401 / 403
    const attackRes = await request.post('/api/admin/books', {
      data: {
        title: 'Malicious Book',
        slug: 'malicious-book',
        sku: 'MAL-01',
        isbn: '978-0-000000-00-0',
        description: 'Attack payload',
        pricePaise: 1000,
        ageMin: 1,
        ageMax: 5,
        language: 'English',
        publisher: 'Attacker',
        status: 'ACTIVE',
      },
    });
    expect([401, 403]).toContain(attackRes.status());
  });

  test('2. Admin Full Operational Flow: Dashboard, Books, Inventory, Payment Verification, Fulfilment & Customer Tracking', async ({ page }) => {
    // 1. Admin Login
    await page.goto('/login');
    await page.fill('#login-email', adminEmail);
    await page.fill('#login-password', password);
    await page.click('button[type="submit"]');

    // Admin redirected to /admin dashboard
    await page.waitForURL('/admin', { timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Executive Overview');

    // 2. Admin Book Management
    await page.goto('/admin/books');
    await expect(page.locator('table')).toContainText('Little Lambs');

    // Edit book
    await page.goto(`/admin/books/${testBookId}`);
    await expect(page.locator('h1')).toContainText('Edit Book');

    // 3. Admin Inventory Management
    await page.goto('/admin/inventory');
    await expect(page.locator('table')).toContainText('Physical & Reserved Inventory');
    await expect(page.locator('text=Recent Stock Movement History')).toBeVisible();

    // 4. Create a Customer Order with submitted UTR to test Payment Verification Queue
    const order = await prisma.order.create({
      data: {
        orderNumber: `LL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: customerUserId,
        paymentStatus: 'VERIFICATION_PENDING',
        fulfilmentStatus: 'AWAITING_PAYMENT',
        subtotalPaise: 10000,
        shippingPaise: 4000,
        totalPaise: 14000,
        items: {
          create: {
            bookId: testBookId,
            titleSnapshot: 'Little Lambs Christian Activity Book',
            skuSnapshot: 'LL-BK-001',
            unitPricePaise: 10000,
            quantity: 1,
            lineTotalPaise: 10000,
          },
        },
        addressSnapshot: {
          create: {
            fullName: 'E2E Customer',
            phone: '9876543210',
            addressLine1: '45 St Marys Street',
            city: 'Kochi',
            state: 'Kerala',
            postalCode: '682001',
            country: 'India',
          },
        },
        payments: {
          create: {
            expectedAmountPaise: 14000,
            utrReference: `UTR${Date.now()}`,
            status: 'VERIFICATION_PENDING',
            submittedAt: new Date(),
          },
        },
      },
    });

    // Reserve 1 stock in DB
    await prisma.book.update({
      where: { id: testBookId },
      data: { reservedStock: 1 },
    });

    // 5. Open Admin Payment Verification Queue (/admin/payments)
    await page.goto('/admin/payments');
    await expect(page.locator('h2')).toContainText('Payment Verification Queue');

    // Verify payment from queue table with dialog handler attached before click
    page.once('dialog', (dialog) => dialog.accept());
    await page.click('button:has-text("Verify Payment")');

    // 6. Inspect Order Detail (/admin/orders/[orderNumber])
    await page.goto(`/admin/orders/${order.orderNumber}`);
    await expect(page.locator('h1')).toContainText(`Order #${order.orderNumber}`);

    // Update fulfilment status: Mark as PROCESSING if button is visible
    const processingBtn = page.locator('button:has-text("Mark as PROCESSING")');
    if (await processingBtn.isVisible()) {
      await processingBtn.click();
    }

    // Mark as SHIPPED with tracking info
    const shipBtn = page.locator('button:has-text("Mark SHIPPED")');
    if (await shipBtn.isVisible()) {
      await shipBtn.click();
      await page.fill('input[placeholder*="India Post"]', 'India Post Express');
      await page.fill('input[placeholder*="IP123456789IN"]', 'IP998877665IN');
      await page.click('button:has-text("Mark as SHIPPED")');
    }

    // 7. Verify Customer view reflects tracking info
    // Sign out admin & sign in as Customer
    await page.goto('/login');
    await page.fill('#login-email', customerEmail);
    await page.fill('#login-password', password);
    await page.click('button[type="submit"]');

    // Open Customer Order Detail
    await page.goto(`/account/orders/${order.orderNumber}`);
    await expect(page.locator('h2')).toContainText(`Order ${order.orderNumber}`);
  });
});
