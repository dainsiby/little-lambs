import { prisma } from '@/lib/db/prisma';

export interface CartItemView {
  id: string;
  bookId: string;
  title: string;
  slug: string;
  imageUrl: string;
  unitPricePaise: number;
  unitPriceDisplay: number; // in Rupees for UI display
  quantity: number;
  lineTotalPaise: number;
  lineTotalDisplay: number; // in Rupees for UI display
  availableStock: number;
}

export interface CartSummaryView {
  id: string;
  userId: string;
  items: CartItemView[];
  totalQuantity: number;
  subtotalPaise: number;
  subtotalDisplay: number;
}

/**
 * Gets or creates an active cart for the authenticated user.
 */
export async function getOrCreateCart(userId: string): Promise<CartSummaryView> {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          book: {
            include: {
              images: {
                orderBy: { sortOrder: 'asc' },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            book: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  const items: CartItemView[] = cart.items.map((item) => {
    const availableStock = Math.max(0, item.book.stock - item.book.reservedStock);
    const unitPricePaise = item.book.pricePaise;
    const lineTotalPaise = unitPricePaise * item.quantity;
    const imageUrl = item.book.images[0]?.imageUrl || '/books/cover-front.png';

    return {
      id: item.id,
      bookId: item.bookId,
      title: item.book.title,
      slug: item.book.slug,
      imageUrl,
      unitPricePaise,
      unitPriceDisplay: unitPricePaise / 100,
      quantity: item.quantity,
      lineTotalPaise,
      lineTotalDisplay: lineTotalPaise / 100,
      availableStock,
    };
  });

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPaise = items.reduce((sum, item) => sum + item.lineTotalPaise, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    totalQuantity,
    subtotalPaise,
    subtotalDisplay: subtotalPaise / 100,
  };
}

/**
 * Adds a book to the authenticated user's cart.
 * Server-authoritative: price and available stock are queried from DB.
 */
export async function addToCart(
  userId: string,
  bookId: string,
  quantity: number = 1
): Promise<{ success: boolean; error?: string }> {
  if (quantity < 1) {
    return { success: false, error: 'Quantity must be at least 1.' };
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book || book.status !== 'ACTIVE') {
    return { success: false, error: 'Product is not available for purchase.' };
  }

  const availableStock = book.stock - book.reservedStock;
  if (availableStock <= 0) {
    return { success: false, error: 'Product is out of stock.' };
  }

  const cartSummary = await getOrCreateCart(userId);
  const existingItem = cartSummary.items.find((item) => item.bookId === bookId);
  const currentQuantity = existingItem ? existingItem.quantity : 0;
  const newQuantity = currentQuantity + quantity;

  if (newQuantity > availableStock) {
    return {
      success: false,
      error: `Cannot add ${quantity} item(s). Only ${availableStock} in stock.`,
    };
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cartSummary.id,
        bookId,
        quantity,
      },
    });
  }

  return { success: true };
}

/**
 * Updates item quantity in the authenticated user's cart.
 */
export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  if (quantity < 1) {
    return removeCartItem(userId, cartItemId);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      cart: true,
      book: true,
    },
  });

  if (!cartItem) {
    return { success: false, error: 'Cart item not found.' };
  }

  // Authorization check: User A cannot modify User B's cart
  if (cartItem.cart.userId !== userId) {
    return { success: false, error: 'Unauthorized cart modification.' };
  }

  const availableStock = cartItem.book.stock - cartItem.book.reservedStock;
  if (quantity > availableStock) {
    return {
      success: false,
      error: `Cannot set quantity to ${quantity}. Only ${availableStock} available.`,
    };
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  return { success: true };
}

/**
 * Removes an item from the authenticated user's cart.
 */
export async function removeCartItem(
  userId: string,
  cartItemId: string
): Promise<{ success: boolean; error?: string }> {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!cartItem) {
    return { success: false, error: 'Cart item not found.' };
  }

  if (cartItem.cart.userId !== userId) {
    return { success: false, error: 'Unauthorized cart modification.' };
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return { success: true };
}

/**
 * Clears all items from the authenticated user's cart.
 */
export async function clearCart(userId: string): Promise<{ success: boolean }> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  return { success: true };
}

/**
 * Gets total item quantity count for the authenticated user's cart header badge.
 */
export async function getCartCount(userId: string | undefined | null): Promise<number> {
  if (!userId) return 0;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return 0;
  }
}
