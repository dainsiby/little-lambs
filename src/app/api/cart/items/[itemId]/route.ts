import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateCartItemQuantity, removeCartItem, getOrCreateCart } from '@/lib/cart/cartService';
import { validateSameOrigin } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { z } from 'zod';

const updateQuantitySchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative.'),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const csrfCheck = validateSameOrigin(req);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(`rate:cart:update:${session.user.id}`, 30, 60 * 1000);
  if (!rateLimit.success && rateLimit.response) {
    return rateLimit.response;
  }

  try {
    const { itemId } = await params;
    const body = await req.json();
    const parsed = updateQuantitySchema.parse(body);

    const result = await updateCartItemQuantity(session.user.id, itemId, parsed.quantity);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update item quantity.' }, { status: 400 });
    }

    const updatedCart = await getOrCreateCart(session.user.id);
    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Invalid quantity value.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update item.' }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const csrfCheck = validateSameOrigin(req);
  if (!csrfCheck.isValid && csrfCheck.errorResponse) {
    return csrfCheck.errorResponse;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    const { itemId } = await params;
    const result = await removeCartItem(session.user.id, itemId);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to remove cart item.' }, { status: 400 });
    }

    const updatedCart = await getOrCreateCart(session.user.id);
    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to remove item from cart.' }, { status: 500 });
  }
}
