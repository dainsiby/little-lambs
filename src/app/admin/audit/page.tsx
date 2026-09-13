import React from 'react';
import { getAdminAuditLogs } from '@/lib/admin/adminAuditService';
import { AuditClient } from './AuditClient';

interface AdminAuditPageProps {
  searchParams: Promise<{
    action?: string;
    entityType?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function AdminAuditPage({ searchParams }: AdminAuditPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const action = resolvedSearchParams.action;
  const entityType = resolvedSearchParams.entityType;
  const search = resolvedSearchParams.search;

  const result = await getAdminAuditLogs({
    action,
    entityType,
    search,
    page,
    limit: 30,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-brand-maroon">
          Audit Log Viewer
        </h1>
        <p className="text-xs text-brand-slate">
          Inspect append-only operational audit records of system activities, stock movements, payment verifications, and order fulfilment updates.
        </p>
      </div>

      <AuditClient
        logs={result.logs as any}
        totalCount={result.totalCount}
        totalPages={result.totalPages}
        currentPage={result.page}
        initialSearch={search || ''}
        initialAction={action || ''}
        initialEntityType={entityType || ''}
      />
    </div>
  );
}
