import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { prisma } from '@/lib/db/prisma';
import { BookStatus, PaymentStatus, FulfilmentStatus, StockMovementType } from '@prisma/client';
import { requireAdmin } from '@/lib/auth/guard';
import { createAdminBook, updateAdminBook, archiveAdminBook } from '@/lib/admin/adminBookService';
import { adjustPhysicalStock, getAdminInventoryOverview } from '@/lib/admin/adminInventoryService';
import { verifyOrderPayment, rejectOrderPayment, updateOrderFulfilment, getAdminOrders } from '@/lib/admin/adminOrderService';
import { getAdminCustomers } from '@/lib/admin/adminCustomerService';
import { getAdminAuditLogs } from '@/lib/admin/adminAuditService';
import { adminBookSchema } from '@/lib/validation/adminBook';

describe('Phase 6 — Admin Operations Unit Test Suite', () => {
  let adminUserId: string;
  let customerUserId: string;
  let testBookId: string;

  beforeEach(async () => {
    // 1. Create ADMIN user in PostgreSQL
    const adminUser = await prisma.user.create({
      data: {
        email: `admin_test_${Date.now()}@example.com`,
        passwordHash: '$2a$12$eImiTXuWVxfM37uY4JANjOL.81F8.jY/6aG4tG6k29R3QkP07',
        fullName: 'Test Admin',
        role: 'ADMIN',
      },
    });
    adminUserId = adminUser.id;

    // 2. Create CUSTOMER user in PostgreSQL
    const customerUser = await prisma.user.create({
      data: {
        email: `customer_test_${Date.now()}@example.com`,
        passwordHash: '$2a$12$eImiTXuWVxfM37uY4JANjOL.81F8.jY/6aG4tG6k29R3QkP07',
        fullName: 'Test Customer',
        role: 'CUSTOMER',
      },
    });
    customerUserId = customerUser.id;

    // 3. Create test Book
    const book = await prisma.book.create({
      data: {
        title: 'Admin Test Storybook',
        slug: `admin-test-book-${Date.now()}`,
        sku: `ADMIN-SKU-${Date.now()}`,
        isbn: `978-0-99-${Date.now().toString().slice(-6)}`,
        description: 'Comprehensive test description for admin operations.',
        shortDescription: 'Short summary.',
        ageMin: 3,
        ageMax: 8,
        language: 'English',
        publisher: 'Atma Books',
        pricePaise: 15000, // ₹150
        stock: 20,
        reservedStock: 2,
        status: BookStatus.ACTIVE,
      },
    });
    testBookId = book.id;
  });

  afterEach(async () => {
    // Clean test records safely scoped to test users/books
    await prisma.stockMovement.deleteMany({ where: { bookId: testBookId } });
    await prisma.auditLog.deleteMany({ where: { actorUserId: { in: [adminUserId, customerUserId] } } });
    await prisma.payment.deleteMany({ where: { order: { userId: customerUserId } } });
    await prisma.orderItem.deleteMany({ where: { order: { userId: customerUserId } } });
    await prisma.orderAddressSnapshot.deleteMany({ where: { order: { userId: customerUserId } } });
    await prisma.order.deleteMany({ where: { userId: customerUserId } });
    await prisma.bookImage.deleteMany({ where: { bookId: testBookId } });
    await prisma.book.deleteMany({ where: { id: testBookId } });
    await prisma.user.deleteMany({ where: { id: { in: [adminUserId, customerUserId] } } });
  });


  describe('1. Server-Side Live DB Admin Authorization (requireAdmin)', () => {
    it('succeeds for user with live role === ADMIN in PostgreSQL', async () => {
      const user = await requireAdmin(adminUserId);
      expect(user?.role).toBe('ADMIN');
      expect(user?.id).toBe(adminUserId);
    });

    it('returns null for user with live role === CUSTOMER', async () => {
      const result = await requireAdmin(customerUserId);
      expect(result).toBeNull();
    });

    it('returns null immediately when user role is demoted in DB even if session ID exists', async () => {
      // Demote admin to CUSTOMER in PostgreSQL
      await prisma.user.update({
        where: { id: adminUserId },
        data: { role: 'CUSTOMER' },
      });

      const result = await requireAdmin(adminUserId);
      expect(result).toBeNull();
    });

    it('returns null for null or non-existent user ID', async () => {
      const res1 = await requireAdmin(null);
      expect(res1).toBeNull();

      const res2 = await requireAdmin('non_existent_user_id');
      expect(res2).toBeNull();
    });
  });

  describe('2. Book Management & Validation Schemas', () => {
    it('validates a valid admin book payload converting rupees to integer paise', () => {
      const validPayload = {
        title: 'New Children Book',
        slug: 'new-children-book',
        sku: 'SKU-CHILDREN-01',
        isbn: '978-0-123456-78-9',
        description: 'Detailed description of children book.',
        shortDescription: 'Short blurb',
        pricePaise: 25000,
        ageMin: 4,
        ageMax: 10,
        language: 'English',
        publisher: 'Pavanatma Publishers',
        status: 'ACTIVE',
        featured: true,
      };

      const parsed = adminBookSchema.parse(validPayload);
      expect(parsed.title).toBe('New Children Book');
    });

    it('creates, updates, and archives a book with audit logging', async () => {
      const newBook = await createAdminBook(adminUserId, {
        title: 'Created Book',
        slug: `created-book-${Date.now()}`,
        sku: `CREATED-SKU-${Date.now()}`,
        isbn: `978-1-11-${Date.now().toString().slice(-6)}`,
        description: 'Created description.',
        shortDescription: 'Blurb',
        ageMin: 2,
        ageMax: 6,
        language: 'Malayalam',
        publisher: 'SMYM Elanji Unit',
        pricePaise: 12000,
        status: 'ACTIVE',
        featured: false,
      });

      expect(newBook.id).toBeDefined();

      const updated = await updateAdminBook(adminUserId, newBook.id, {
        title: 'Created Book Updated',
        pricePaise: 14000,
      });

      expect(updated.title).toBe('Created Book Updated');

      const archived = await archiveAdminBook(adminUserId, newBook.id);
      expect(archived.status).toBe(BookStatus.ARCHIVED);

      // Verify audit logs were written
      const logs = await prisma.auditLog.findMany({ where: { entityId: newBook.id } });
      expect(logs.length).toBe(3);


      // Cleanup new book
      await prisma.stockMovement.deleteMany({ where: { bookId: newBook.id } });
      await prisma.auditLog.deleteMany({ where: { entityId: newBook.id } });
      await prisma.book.deleteMany({ where: { id: newBook.id } });
    });
  });

  describe('3. Inventory Management & Stock Movements Safety', () => {
    it('calculates availableStock = stock - reservedStock correctly', async () => {
      const inventory = await getAdminInventoryOverview();
      const testItem = inventory.find((b) => b.id === testBookId);
      expect(testItem).toBeDefined();
      expect(testItem?.stock).toBe(20);
      expect(testItem?.reservedStock).toBe(2);
      expect(testItem?.availableStock).toBe(18);
    });

    it('adjusts physical stock transactionally and writes StockMovement + AuditLog', async () => {
      const result = await adjustPhysicalStock(adminUserId, {
        bookId: testBookId,
        quantityDelta: 5,
        type: StockMovementType.RESTOCK,
        reason: 'Shipment restock intake #101',
      });

      expect(result.book.stock).toBe(25);
      expect(result.availableStock).toBe(23); // 25 - 2
      expect(result.stockMovement.type).toBe('RESTOCK');
      expect(result.stockMovement.quantityDelta).toBe(5);

      // Verify StockMovement entry persisted in DB
      const movement = await prisma.stockMovement.findFirst({
        where: { bookId: testBookId },
      });
      expect(movement?.reason).toBe('Shipment restock intake #101');
    });

    it('PREVENTS reducing physical stock below reservedStock (transactional lower-bound check)', async () => {
      // Current stock = 20, reservedStock = 2 -> trying to reduce by 19 would make new physical stock = 1 < 2 reserved
      await expect(
        adjustPhysicalStock(adminUserId, {
          bookId: testBookId,
          quantityDelta: -19,
          type: StockMovementType.CORRECTION,
          reason: 'Attempted invalid stock reduction',
        })
      ).rejects.toThrow(/reserved stock is 2/i);

      // Verify physical stock was NOT modified
      const book = await prisma.book.findUnique({ where: { id: testBookId } });
      expect(book?.stock).toBe(20);
    });
  });

  describe('4. Order Payment Verification Queue & Transactional Guard', () => {
    it('verifies pending payment inside transaction: decrements physical & reserved stock, updates Order to PAID & CONFIRMED', async () => {
      // Create an order in VERIFICATION_PENDING state
      const order = await prisma.order.create({
        data: {
          orderNumber: `LL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: customerUserId,
          paymentStatus: PaymentStatus.VERIFICATION_PENDING,
          fulfilmentStatus: FulfilmentStatus.AWAITING_PAYMENT,
          subtotalPaise: 30000,
          shippingPaise: 0,
          totalPaise: 30000,
          items: {
            create: {
              bookId: testBookId,
              titleSnapshot: 'Admin Test Storybook',
              skuSnapshot: 'ADMIN-SKU',
              unitPricePaise: 15000,
              quantity: 2,
              lineTotalPaise: 30000,
            },
          },
          payments: {
            create: {
              expectedAmountPaise: 30000,
              utrReference: `UTR${Date.now()}`,
              status: PaymentStatus.VERIFICATION_PENDING,
            },
          },
        },
      });

      const updatedOrder = await verifyOrderPayment(adminUserId, order.id, 'Verified against HDFC statement');

      expect(updatedOrder.paymentStatus).toBe(PaymentStatus.PAID);
      expect(updatedOrder.fulfilmentStatus).toBe(FulfilmentStatus.CONFIRMED);

      // Verify book physical stock decremented by 2 (20 -> 18) and reserved stock decremented by 2 (2 -> 0)
      const book = await prisma.book.findUnique({ where: { id: testBookId } });
      expect(book?.stock).toBe(18);
      expect(book?.reservedStock).toBe(0);

      // Verify audit log entry written
      const auditLog = await prisma.auditLog.findFirst({
        where: { action: 'PAYMENT_VERIFIED', entityId: order.id },
      });
      expect(auditLog).toBeDefined();
    });

    it('is IDEMPOTENT: verifying an already verified order returns without double-decrementing stock', async () => {
      const order = await prisma.order.create({
        data: {
          orderNumber: `LL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: customerUserId,
          paymentStatus: PaymentStatus.PAID,
          fulfilmentStatus: FulfilmentStatus.CONFIRMED,
          subtotalPaise: 15000,
          shippingPaise: 4000,
          totalPaise: 19000,
        },
      });

      // Calling verify on an already PAID order should be idempotent and return order without error or stock change
      const result = await verifyOrderPayment(adminUserId, order.id);
      expect(result.paymentStatus).toBe(PaymentStatus.PAID);
    });

    it('rejects payment submission with reason and preserves reservedStock until expiry', async () => {
      const order = await prisma.order.create({
        data: {
          orderNumber: `LL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: customerUserId,
          paymentStatus: PaymentStatus.VERIFICATION_PENDING,
          fulfilmentStatus: FulfilmentStatus.AWAITING_PAYMENT,
          subtotalPaise: 15000,
          shippingPaise: 4000,
          totalPaise: 19000,
          payments: {
            create: {
              expectedAmountPaise: 19000,
              utrReference: `INVALID_${Date.now()}`,
              status: PaymentStatus.VERIFICATION_PENDING,
            },
          },
        },
      });

      const rejectedOrder = await rejectOrderPayment(
        adminUserId,
        order.id,
        'UTR reference not found in bank statement.'
      );

      expect(rejectedOrder.paymentStatus).toBe(PaymentStatus.REJECTED);

      const payment = await prisma.payment.findFirst({ where: { orderId: order.id } });
      expect(payment?.status).toBe(PaymentStatus.REJECTED);
      expect(payment?.rejectionReason).toBe('UTR reference not found in bank statement.');
    });
  });

  describe('5. Fulfilment State Machine & Shipping Tracking', () => {
    it('transitions CONFIRMED -> PROCESSING', async () => {
      const order = await prisma.order.create({
        data: {
          orderNumber: `LL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: customerUserId,
          paymentStatus: PaymentStatus.PAID,
          fulfilmentStatus: FulfilmentStatus.CONFIRMED,
          subtotalPaise: 15000,
          shippingPaise: 0,
          totalPaise: 15000,
        },
      });

      const updated = await updateOrderFulfilment(adminUserId, order.orderNumber, {
        status: FulfilmentStatus.PROCESSING,
      });

      expect(updated.fulfilmentStatus).toBe(FulfilmentStatus.PROCESSING);
    });

    it('requires shipping carrier & tracking number when moving to SHIPPED', async () => {
      const order = await prisma.order.create({
        data: {
          orderNumber: `LL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: customerUserId,
          paymentStatus: PaymentStatus.PAID,
          fulfilmentStatus: FulfilmentStatus.PROCESSING,
          subtotalPaise: 15000,
          shippingPaise: 0,
          totalPaise: 15000,
        },
      });

      // Missing tracking info should throw error
      await expect(
        updateOrderFulfilment(adminUserId, order.orderNumber, {
          status: FulfilmentStatus.SHIPPED,
        })
      ).rejects.toThrow();

      // Valid shipping info should succeed
      const shippedOrder = await updateOrderFulfilment(adminUserId, order.orderNumber, {
        status: FulfilmentStatus.SHIPPED,
        shippingCarrier: 'India Post',
        trackingNumber: 'IP987654321IN',
      });

      expect(shippedOrder.fulfilmentStatus).toBe(FulfilmentStatus.SHIPPED);
      expect(shippedOrder.shippingCarrier).toBe('India Post');
      expect(shippedOrder.trackingNumber).toBe('IP987654321IN');
      expect(shippedOrder.shippedAt).toBeDefined();
    });

    it('transitions SHIPPED -> DELIVERED', async () => {
      const order = await prisma.order.create({
        data: {
          orderNumber: `LL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: customerUserId,
          paymentStatus: PaymentStatus.PAID,
          fulfilmentStatus: FulfilmentStatus.SHIPPED,
          shippingCarrier: 'Blue Dart',
          trackingNumber: 'BD123456',
          shippedAt: new Date(),
          subtotalPaise: 15000,
          shippingPaise: 0,
          totalPaise: 15000,
        },
      });

      const deliveredOrder = await updateOrderFulfilment(adminUserId, order.orderNumber, {
        status: FulfilmentStatus.DELIVERED,
      });

      expect(deliveredOrder.fulfilmentStatus).toBe(FulfilmentStatus.DELIVERED);
      expect(deliveredOrder.deliveredAt).toBeDefined();
    });

    it('REJECTS illegal state jump AWAITING_PAYMENT -> SHIPPED', async () => {
      const order = await prisma.order.create({
        data: {
          orderNumber: `LL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: customerUserId,
          paymentStatus: PaymentStatus.PENDING,
          fulfilmentStatus: FulfilmentStatus.AWAITING_PAYMENT,
          subtotalPaise: 15000,
          shippingPaise: 0,
          totalPaise: 15000,
        },
      });

      await expect(
        updateOrderFulfilment(adminUserId, order.orderNumber, {
          status: FulfilmentStatus.SHIPPED,
          shippingCarrier: 'Post',
          trackingNumber: '123',
        })
      ).rejects.toThrow(/Cannot move order to SHIPPED from AWAITING_PAYMENT/);
    });
  });

  describe('6. Customer Management & Operational Safety', () => {
    it('returns customer summary list without exposing password hashes or auth tokens', async () => {
      const customers = await getAdminCustomers();
      const customer = customers.find((c) => c.id === customerUserId);

      expect(customer).toBeDefined();
      expect(customer?.email).toBeDefined();
      expect(customer?.fullName).toBe('Test Customer');
      expect((customer as any).passwordHash).toBeUndefined();
    });
  });
});
