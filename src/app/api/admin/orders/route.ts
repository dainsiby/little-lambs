import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { requireAdmin } from '@/lib/auth/guard';
import { getAdminOrders } from '@/lib/admin/adminOrderService';

export async function GET(req: Request) {
  const session = await auth();
  const admin = await requireAdmin(session?.user?.id);

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const url = new URL(req.url);
  const paymentStatus = url.searchParams.get('paymentStatus') as any;
  const fulfilmentStatus = url.searchParams.get('fulfilmentStatus') as any;
  const search = url.searchParams.get('search') || undefined;
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  try {
    const data = await getAdminOrders({
      paymentStatus: paymentStatus || undefined,
      fulfilmentStatus: fulfilmentStatus || undefined,
      search,
      page,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}
