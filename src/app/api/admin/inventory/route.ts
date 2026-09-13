import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { requireAdmin } from '@/lib/auth/guard';
import { getAdminInventoryOverview, adjustPhysicalStock } from '@/lib/admin/adminInventoryService';
import { validateSameOrigin } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rateLimit';

export async function GET() {
  const session = await auth();
  const admin = await requireAdmin(session?.user?.id);

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  try {
    const inventory = await getAdminInventoryOverview();
    return NextResponse.json({ inventory });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const csrfCheck = validateSameOrigin(req);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  const admin = await requireAdmin(session?.user?.id);

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const rateLimit = await checkRateLimit(`rate:admin:inventory:${admin.id}`, 30, 15 * 60 * 1000);
  if (!rateLimit.success && rateLimit.response) {
    return rateLimit.response;
  }

  try {
    const body = await req.json();
    const result = await adjustPhysicalStock(admin.id, body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to adjust stock' }, { status: 400 });
  }
}
