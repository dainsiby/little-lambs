import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getOrCreateCart, addToCart, clearCart } from '@/lib/cart/cartService';
import { validateSameOrigin } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { z } from 'zod';

const addToCartSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required.'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1.').default(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    const cart = await getOrCreateCart(session.user.id);
    return NextResponse.json(cart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch cart.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const csrfCheck = validateSameOrigin(req);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(`rate:cart:add:${session.user.id}`, 30, 60 * 1000);
  if (!rateLimit.success && rateLimit.response) {
    return rateLimit.response;
  }

  try {
    const body = await req.json();
    const parsed = addToCartSchema.parse(body);

    const result = await addToCart(session.user.id, parsed.bookId, parsed.quantity);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to add item to cart.' }, { status: 400 });
    }

    const updatedCart = await getOrCreateCart(session.user.id);
    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Invalid input data.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to add item to cart.' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const csrfCheck = validateSameOrigin(req);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    await clearCart(session.user.id);
    const updatedCart = await getOrCreateCart(session.user.id);
    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to clear cart.' }, { status: 500 });
  }
}
