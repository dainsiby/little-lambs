import { prisma } from '@/lib/db/prisma';

export interface AdminCustomerSummary {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  createdAt: Date;
  orderCount: number;
}

export async function getAdminCustomers(): Promise<AdminCustomerSummary[]> {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  return customers.map(
    (c: {
      id: string;
      fullName: string | null;
      email: string;
      phone: string | null;
      createdAt: Date;
      _count: { orders: number };
    }) => ({
      id: c.id,
      fullName: c.fullName,
      email: c.email,
      phone: c.phone,
      createdAt: c.createdAt,
      orderCount: c._count.orders,
    })
  );
}

