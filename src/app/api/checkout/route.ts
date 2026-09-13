import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { createOrder } from '@/lib/orders/orderService';
import { validateSameOrigin } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rateLimit';

export async function POST(req: Request) {
  const csrfCheck = validateSameOrigin(req);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in to place an order.' }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(`rate:checkout:${session.user.id}`, 10, 15 * 60 * 1000);
  if (!rateLimit.success && rateLimit.response) {
    return rateLimit.response;
  }

  try {
    const body = await req.json();
    const { addressId, customerNotes, idempotencyKey } = body;

    if (!addressId) {
      return NextResponse.json({ error: 'Delivery address is required.' }, { status: 400 });
    }

    const order = await createOrder({
      userId: session.user.id,
      addressId,
      customerNotes,
      idempotencyKey,
    });

    return NextResponse.json({ orderNumber: order.orderNumber, orderId: order.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to place order.' }, { status: 400 });
  }
}

