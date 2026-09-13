import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { requireAdmin } from '@/lib/auth/guard';
import { updateOrderFulfilment } from '@/lib/admin/adminOrderService';

export async function POST(req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await auth();
  const admin = await requireAdmin(session?.user?.id);

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const { orderNumber } = await params;

  try {
    const body = await req.json();
    const order = await updateOrderFulfilment(admin.id, orderNumber, body);
    return NextResponse.json({ message: 'Fulfilment status updated', order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Fulfilment transition failed' }, { status: 400 });
  }
}
