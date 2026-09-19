import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  const session = await auth();
  const admin = await requireAdmin(session?.user?.id);

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q || q.length < 2) {
    return NextResponse.json({ orders: [], books: [], customers: [] });
  }

  try {
    const [orders, books, customers] = await Promise.all([
      prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: { contains: q, mode: 'insensitive' } },
            { user: { fullName: { contains: q, mode: 'insensitive' } } },
            { user: { email: { contains: q, mode: 'insensitive' } } },
            { payments: { some: { utrReference: { contains: q, mode: 'insensitive' } } } },
          ],
        },
        take: 5,
        orderBy: { placedAt: 'desc' },
        include: {
          user: { select: { fullName: true, email: true } },
        },
      }),
      prisma.book.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { sku: { contains: q, mode: 'insensitive' } },
            { isbn: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          sku: true,
          stock: true,
          status: true,
        },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { fullName: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
      }),
    ]);

    const formattedOrders = orders.map((ord) => ({
      orderNumber: ord.orderNumber,
      customerName: ord.user.fullName,
      totalAmountPaise: ord.totalPaise,
      status: ord.fulfilmentStatus,
    }));

    return NextResponse.json({
      orders: formattedOrders,
      books,
      customers,
    });
  } catch (error) {
    console.error('Error executing admin global search:', error);
    return NextResponse.json({ error: 'Search failed.' }, { status: 500 });
  }
}
