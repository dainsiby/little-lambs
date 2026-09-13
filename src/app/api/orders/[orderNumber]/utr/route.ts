import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { submitUtr } from '@/lib/payment/paymentService';
import { validateSameOrigin } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rateLimit';

export async function POST(req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const csrfCheck = validateSameOrigin(req);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(`rate:utr:${session.user.id}`, 10, 15 * 60 * 1000);
  if (!rateLimit.success && rateLimit.response) {
    return rateLimit.response;
  }

  const { orderNumber } = await params;

  try {
    const body = await req.json();
    const { utrReference } = body;

    if (!utrReference) {
      return NextResponse.json({ error: 'UTR / Transaction Reference is required.' }, { status: 400 });
    }

    const order = await submitUtr(session.user.id, orderNumber, utrReference);

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit UTR reference.' }, { status: 400 });
  }
}

