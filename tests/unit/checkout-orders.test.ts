import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { calculateShippingPaise } from '@/lib/shipping/shippingStrategy';
import { generateOrderNumber } from '@/lib/orders/orderNumberGenerator';
import { addressSchema } from '@/lib/validation/address';
import { expireStaleReservations } from '@/lib/orders/expirationService';
import { submitUtr, confirmPaymentTransaction } from '@/lib/payment/paymentService';
import { createOrder } from '@/lib/orders/orderService';
import { prisma } from '@/lib/db/prisma';
import { BookStatus, PaymentStatus, FulfilmentStatus } from '@prisma/client';

describe('Combined Checkout + Orders + Stock Reservation Unit Test Suite', () => {
  let testUserId: string;
  let testAddressId: string;
  let testBookId: string;

  beforeEach(async () => {
    // Setup clean test data in PostgreSQL
    const user = await prisma.user.create({
      data: {
        email: `test_checkout_${Date.now()}@example.com`,
        passwordHash: '$2a$12$eImiTXuWVxfM37uY4JANjOL.81F8.jY/6aG4tG6k29R3QkP07',
        fullName: 'Test Checkout User',
        phone: '9876543210',
      },
    });
    testUserId = user.id;

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName: 'Test Checkout User',
        phone: '9876543210',
        addressLine1: '123 St Thomas Street',
        city: 'Kochi',
        state: 'Kerala',
        postalCode: '682001',
        country: 'India',
        isDefault: true,
      },
    });
    testAddressId = address.id;

    const book = await prisma.book.create({
      data: {
        title: 'Test Activity Book',
        slug: `test-book-${Date.now()}`,
        sku: `SKU-TEST-${Date.now()}`,
        isbn: `978-0-00-${Date.now().toString().slice(-6)}`,
        description: 'Test Description',
        ageMin: 4,
        ageMax: 10,
        language: 'English',
        publisher: 'Test Publisher',
        pricePaise: 10000, // ₹100
        stock: 10,
        reservedStock: 0,
        status: BookStatus.ACTIVE,
      },
    });
    testBookId = book.id;
  });

  afterEach(async () => {
    // Clean test records scoped to testUserId
    await prisma.stockMovement.deleteMany({ where: { bookId: testBookId } });
    await prisma.auditLog.deleteMany({ where: { actorUserId: testUserId } });
    await prisma.payment.deleteMany({ where: { order: { userId: testUserId } } });
    await prisma.orderItem.deleteMany({ where: { order: { userId: testUserId } } });
    await prisma.orderAddressSnapshot.deleteMany({ where: { order: { userId: testUserId } } });
    await prisma.order.deleteMany({ where: { userId: testUserId } });
    await prisma.cartItem.deleteMany({ where: { cart: { userId: testUserId } } });
    await prisma.cart.deleteMany({ where: { userId: testUserId } });
    await prisma.address.deleteMany({ where: { userId: testUserId } });
    await prisma.book.deleteMany({ where: { id: testBookId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });


  describe('1. Shipping Calculation Strategy', () => {
    it('returns 0 for subtotal 0', () => {
      expect(calculateShippingPaise(0)).toBe(0);
    });

    it('returns ₹40 flat rate (4000 paise) for subtotal below threshold (e.g. ₹100 / 10000 paise)', () => {
      expect(calculateShippingPaise(10000)).toBe(4000);
    });

    it('returns ₹40 flat rate (4000 paise) for subtotal 29999 paise', () => {
      expect(calculateShippingPaise(29999)).toBe(4000);
    });

    it('returns FREE shipping (0 paise) for subtotal meeting threshold (30000 paise / ₹300)', () => {
      expect(calculateShippingPaise(30000)).toBe(0);
    });

    it('returns FREE shipping (0 paise) for subtotal exceeding threshold (50000 paise)', () => {
      expect(calculateShippingPaise(50000)).toBe(0);
    });
  });

  describe('2. Order Number Generator', () => {
    it('generates unique order numbers matching LL-YYYY-XXXXXX format', () => {
      const num1 = generateOrderNumber();
      const num2 = generateOrderNumber();
      const year = new Date().getFullYear();

      expect(num1).toMatch(new RegExp(`^LL-${year}-\\d{6}$`));
      expect(num2).toMatch(new RegExp(`^LL-${year}-\\d{6}$`));
      expect(num1).not.toBe(num2);
    });
  });

  describe('3. Address Validation', () => {
    it('validates a correct address schema', () => {
      const validData = {
        fullName: 'John Doe',
        phone: '9876543210',
        addressLine1: '45 Church Road',
        city: 'Ernakulam',
        state: 'Kerala',
        postalCode: '682011',
        country: 'India',
        isDefault: true,
      };
      expect(() => addressSchema.parse(validData)).not.toThrow();
    });

    it('rejects malformed phone or short address', () => {
      const invalidData = {
        fullName: 'J',
        phone: 'abc',
        addressLine1: '123',
        city: '',
        state: '',
        postalCode: '12',
        country: 'India',
      };
      expect(() => addressSchema.parse(invalidData)).toThrow();
    });
  });

  describe('4. Transactional Order Creation & Stock Reservation', () => {
    it('creates order, reserves stock, creates address snapshot, clears cart, and sets 24h expiry', async () => {
      // Create user cart with 2 items
      const cart = await prisma.cart.create({ data: { userId: testUserId } });
      await prisma.cartItem.create({
        data: { cartId: cart.id, bookId: testBookId, quantity: 2 },
      });

      const order = await createOrder({
        userId: testUserId,
        addressId: testAddressId,
        customerNotes: 'Test delivery note',
      });

      expect(order.orderNumber).toMatch(/^LL-/);
      expect(order.subtotalPaise).toBe(20000); // 2 * 10000
      expect(order.shippingPaise).toBe(4000); // flat shipping
      expect(order.totalPaise).toBe(24000);
      expect(order.paymentStatus).toBe(PaymentStatus.PENDING);
      expect(order.fulfilmentStatus).toBe(FulfilmentStatus.AWAITING_PAYMENT);

      // Verify reservedStock increased by 2
      const updatedBook = await prisma.book.findUnique({ where: { id: testBookId } });
      expect(updatedBook?.reservedStock).toBe(2);

      // Verify cart was cleared
      const remainingCartItems = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
      expect(remainingCartItems.length).toBe(0);

      // Verify address snapshot created
      const snapshot = await prisma.orderAddressSnapshot.findUnique({ where: { orderId: order.id } });
      expect(snapshot?.fullName).toBe('Test Checkout User');
      expect(snapshot?.city).toBe('Kochi');
    });

    it('prevents order creation when requested quantity exceeds available stock (stock - reservedStock)', async () => {
      // Set book stock = 2, reservedStock = 1 -> available = 1
      await prisma.book.update({
        where: { id: testBookId },
        data: { stock: 2, reservedStock: 1 },
      });

      const cart = await prisma.cart.create({ data: { userId: testUserId } });
      await prisma.cartItem.create({
        data: { cartId: cart.id, bookId: testBookId, quantity: 2 },
      });

      await expect(
        createOrder({
          userId: testUserId,
          addressId: testAddressId,
        })
      ).rejects.toThrow(/Insufficient available stock/);
    });

    it('prevents double order creation using idempotency key', async () => {
      const cart = await prisma.cart.create({ data: { userId: testUserId } });
      await prisma.cartItem.create({
        data: { cartId: cart.id, bookId: testBookId, quantity: 1 },
      });

      const order1 = await createOrder({
        userId: testUserId,
        addressId: testAddressId,
        idempotencyKey: 'test_token_123',
      });

      const order2 = await createOrder({
        userId: testUserId,
        addressId: testAddressId,
        idempotencyKey: 'test_token_123',
      });

      expect(order1.id).toBe(order2.id);
      expect(order1.orderNumber).toBe(order2.orderNumber);
    });
  });

  describe('5. Stock Reservation Expiration Service', () => {
    it('expires PENDING orders past expiry date and releases reserved stock', async () => {
      // Create order with past reservation expiry date
      const pastDate = new Date(Date.now() - 10000);
      await prisma.book.update({
        where: { id: testBookId },
        data: { stock: 10, reservedStock: 2 },
      });

      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: testUserId,
          paymentStatus: PaymentStatus.PENDING,
          fulfilmentStatus: FulfilmentStatus.AWAITING_PAYMENT,
          subtotalPaise: 20000,
          shippingPaise: 4000,
          totalPaise: 24000,
          reservationExpiresAt: pastDate,
          items: {
            create: {
              bookId: testBookId,
              titleSnapshot: 'Test Activity Book',
              skuSnapshot: 'SKU-TEST',
              unitPricePaise: 10000,
              quantity: 2,
              lineTotalPaise: 20000,
            },
          },
        },
      });

      const result = await expireStaleReservations();
      expect(result.expiredCount).toBe(1);

      // Verify reservedStock decremented back to 0
      const updatedBook = await prisma.book.findUnique({ where: { id: testBookId } });
      expect(updatedBook?.reservedStock).toBe(0);

      // Verify order cancelled
      const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
      expect(updatedOrder?.fulfilmentStatus).toBe(FulfilmentStatus.CANCELLED);
      expect(updatedOrder?.reservationExpiresAt).toBeNull();
    });

    it('DOES NOT expire VERIFICATION_PENDING orders even if reservation date is in the past', async () => {
      const pastDate = new Date(Date.now() - 10000);
      await prisma.book.update({
        where: { id: testBookId },
        data: { stock: 10, reservedStock: 2 },
      });

      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: testUserId,
          paymentStatus: PaymentStatus.VERIFICATION_PENDING,
          fulfilmentStatus: FulfilmentStatus.AWAITING_PAYMENT,
          subtotalPaise: 20000,
          shippingPaise: 4000,
          totalPaise: 24000,
          reservationExpiresAt: pastDate,
          items: {
            create: {
              bookId: testBookId,
              titleSnapshot: 'Test Activity Book',
              skuSnapshot: 'SKU-TEST',
              unitPricePaise: 10000,
              quantity: 2,
              lineTotalPaise: 20000,
            },
          },
        },
      });

      const result = await expireStaleReservations();
      expect(result.expiredCount).toBe(0);

      const updatedBook = await prisma.book.findUnique({ where: { id: testBookId } });
      expect(updatedBook?.reservedStock).toBe(2);

      const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
      expect(updatedOrder?.fulfilmentStatus).toBe(FulfilmentStatus.AWAITING_PAYMENT);
    });
  });

  describe('6. UTR Reference Submission & Payment Verification Service', () => {
    it('submits valid UTR reference, updates status to VERIFICATION_PENDING, and prevents duplicate UTR reuse', async () => {
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: testUserId,
          paymentStatus: PaymentStatus.PENDING,
          fulfilmentStatus: FulfilmentStatus.AWAITING_PAYMENT,
          subtotalPaise: 10000,
          shippingPaise: 4000,
          totalPaise: 14000,
          payments: {
            create: {
              expectedAmountPaise: 14000,
              status: PaymentStatus.PENDING,
            },
          },
        },
      });

      const updatedOrder = await submitUtr(testUserId, order.orderNumber, 'UTR123456789');
      expect(updatedOrder.paymentStatus).toBe(PaymentStatus.VERIFICATION_PENDING);

      const payment = await prisma.payment.findFirst({ where: { orderId: order.id } });
      expect(payment?.utrReference).toBe('UTR123456789');
      expect(payment?.status).toBe(PaymentStatus.VERIFICATION_PENDING);

      // Attempting to submit same UTR on another order should fail
      const order2 = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: testUserId,
          paymentStatus: PaymentStatus.PENDING,
          fulfilmentStatus: FulfilmentStatus.AWAITING_PAYMENT,
          subtotalPaise: 10000,
          shippingPaise: 4000,
          totalPaise: 14000,
        },
      });

      await expect(submitUtr(testUserId, order2.orderNumber, 'UTR123456789')).rejects.toThrow(
        /already been submitted/
      );
    });

    it('admin confirmPaymentTransaction decrements physical stock & reserved stock and sets PAID & CONFIRMED', async () => {
      await prisma.book.update({
        where: { id: testBookId },
        data: { stock: 10, reservedStock: 2 },
      });

      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: testUserId,
          paymentStatus: PaymentStatus.VERIFICATION_PENDING,
          fulfilmentStatus: FulfilmentStatus.AWAITING_PAYMENT,
          subtotalPaise: 20000,
          shippingPaise: 4000,
          totalPaise: 24000,
          items: {
            create: {
              bookId: testBookId,
              titleSnapshot: 'Test Activity Book',
              skuSnapshot: 'SKU-TEST',
              unitPricePaise: 10000,
              quantity: 2,
              lineTotalPaise: 20000,
            },
          },
          payments: {
            create: {
              expectedAmountPaise: 24000,
              utrReference: 'UTR999999999',
              status: PaymentStatus.VERIFICATION_PENDING,
            },
          },
        },
      });

      const confirmedOrder = await confirmPaymentTransaction('admin_user_id', order.id);

      expect(confirmedOrder.paymentStatus).toBe(PaymentStatus.PAID);
      expect(confirmedOrder.fulfilmentStatus).toBe(FulfilmentStatus.CONFIRMED);

      // Verify physical stock decremented from 10 to 8, reserved stock decremented from 2 to 0
      const updatedBook = await prisma.book.findUnique({ where: { id: testBookId } });
      expect(updatedBook?.stock).toBe(8);
      expect(updatedBook?.reservedStock).toBe(0);
    });
  });
});
