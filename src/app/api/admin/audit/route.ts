import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { requireAdmin } from '@/lib/auth/guard';
import { getAdminAuditLogs } from '@/lib/admin/adminAuditService';

export async function GET(req: Request) {
  const session = await auth();
  const admin = await requireAdmin(session?.user?.id);

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action') || undefined;
  const entityType = url.searchParams.get('entityType') || undefined;
  const search = url.searchParams.get('search') || undefined;
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  try {
    const data = await getAdminAuditLogs({ action, entityType, search, page });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch audit logs' }, { status: 500 });
  }
}
