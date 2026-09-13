import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { requireAdmin } from '@/lib/auth/guard';
import { verifyOrderPayment, rejectOrderPayment } from '@/lib/admin/adminOrderService';
import { validateSameOrigin } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rateLimit';

export async function POST(req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  // CSRF Origin validation
  const csrfCheck = validateSameOrigin(req);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  const admin = await requireAdmin(session?.user?.id);

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  // Rate Limiting (20 calls / 15 min per admin)
  const rateLimit = await checkRateLimit(`rate:admin:payment:${admin.id}`, 20, 15 * 60 * 1000);
  if (!rateLimit.success && rateLimit.response) {
    return rateLimit.response;
  }

  const { orderNumber } = await params;

  try {
    const body = await req.json();
    const { action, orderId, rejectionReason, adminNote } = body;

    if (action === 'VERIFY') {
      const order = await verifyOrderPayment(admin.id, orderId, adminNote);
      return NextResponse.json({ message: 'Payment verified successfully', order });
    } else if (action === 'REJECT') {
      if (!rejectionReason) {
        return NextResponse.json({ error: 'Rejection reason is required.' }, { status: 400 });
      }
      const order = await rejectOrderPayment(admin.id, orderId, rejectionReason, adminNote);
      return NextResponse.json({ message: 'Payment rejected successfully', order });
    }

    return NextResponse.json({ error: 'Invalid payment verification action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Payment action failed' }, { status: 400 });
  }
}
