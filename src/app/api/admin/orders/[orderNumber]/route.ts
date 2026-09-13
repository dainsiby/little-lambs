import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { requireAdmin } from '@/lib/auth/guard';
import { getAdminOrderByNumber } from '@/lib/admin/adminOrderService';

export async function GET(req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await auth();
  const admin = await requireAdmin(session?.user?.id);

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const { orderNumber } = await params;

  try {
    const data = await getAdminOrderByNumber(orderNumber);
    if (!data) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch order' }, { status: 500 });
  }
}
