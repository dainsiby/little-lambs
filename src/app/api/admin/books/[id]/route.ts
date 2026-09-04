import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/auth/guard';
import { validateSameOrigin } from '@/lib/security/csrf';
import { bookUpdateSchema } from '@/lib/validation/book';
import { getAdminBookById, updateAdminBook, archiveAdminBook } from '@/lib/admin/books';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth();
  const admin = await requireAdmin(session?.user?.id);

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const book = await getAdminBookById(id);

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  return NextResponse.json({ book });
}

export async function PUT(request: Request, { params }: RouteParams) {
  // CSRF / Origin Header Check
  const csrfCheck = validateSameOrigin(request);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  // Direct DB Role Verification
  const admin = await requireAdmin(session.user.id);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = bookUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await updateAdminBook(id, parsed.data, admin.id);
    return NextResponse.json({ book: updated });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  // CSRF / Origin Header Check
  const csrfCheck = validateSameOrigin(request);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  // Direct DB Role Verification
  const admin = await requireAdmin(session.user.id);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const archived = await archiveAdminBook(id, admin.id);
    return NextResponse.json({ book: archived, message: 'Book archived successfully' });
  } catch (error) {
    console.error('Error archiving book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
