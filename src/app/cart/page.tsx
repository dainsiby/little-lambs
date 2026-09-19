import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getOrCreateCart } from '@/lib/cart/cartService';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/Footer';
import { CartView } from '@/components/cart/CartView';
import InnerHeader from '@/components/layout/InnerHeader';

export const metadata = {
  title: 'Shopping Cart | Little Lambs Store',
  description: 'View and manage items in your Little Lambs shopping cart.',
};

export const revalidate = 0; // Dynamic server rendering for live cart items

export default async function CartPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/cart');
  }

  const cart = await getOrCreateCart(session.user.id);

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Your Cart"
          subtitle="Review your selected books before checkout."
          badge="Shopping Cart"
        />

        <article className="cart-container">
          <CartView initialCart={cart} />
        </article>

        <Footer inner />
      </div>
    </main>
  );
}
