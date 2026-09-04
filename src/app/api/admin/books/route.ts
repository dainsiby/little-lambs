import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/auth/guard';
import { validateSameOrigin } from '@/lib/security/csrf';
import { bookCreateSchema } from '@/lib/validation/book';
import { getAllAdminBooks, createAdminBook } from '@/lib/admin/books';

export async function GET() {
  const session = await auth();
  const admin = await requireAdmin(session?.user?.id);

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const books = await getAllAdminBooks();
    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error fetching admin books:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // CSRF / Origin Header Check
  const csrfCheck = validateSameOrigin(request);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  // Direct PostgreSQL DB Role Lookup
  const admin = await requireAdmin(session.user.id);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = bookCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const book = await createAdminBook(
      {
        ...parsed.data,
        price: parsed.data.price,
      },
      admin.id
    );

    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
