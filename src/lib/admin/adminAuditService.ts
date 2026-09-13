import { prisma } from '@/lib/db/prisma';

export interface AuditLogFilterOptions {
  action?: string;
  entityType?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getAdminAuditLogs(options: AuditLogFilterOptions = {}) {
  const { action, entityType, search, page = 1, limit = 30 } = options;

  const where: any = {};

  if (action) {
    where.action = action;
  }

  if (entityType) {
    where.entityType = entityType;
  }

  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { action: { contains: term, mode: 'insensitive' } },
      { entityType: { contains: term, mode: 'insensitive' } },
      { entityId: { contains: term, mode: 'insensitive' } },
      { actor: { email: { contains: term, mode: 'insensitive' } } },
    ];
  }

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        actor: { select: { id: true, fullName: true, email: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    page,
  };
}
