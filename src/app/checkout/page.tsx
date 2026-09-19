import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getOrCreateCart } from '@/lib/cart/cartService';
import { getUserAddresses } from '@/lib/addresses/addressService';
import { calculateShippingPaise } from '@/lib/shipping/shippingStrategy';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/Footer';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import InnerHeader from '@/components/layout/InnerHeader';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export const metadata = {
  title: 'Checkout | Little Lambs Store',
  description: 'Complete your book order with shipping details and manual UPI payment.',
};

export const revalidate = 0; // Dynamic server rendering for live checkout

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/checkout');
  }

  const cart = await getOrCreateCart(session.user.id);

  if (cart.items.length === 0) {
    return (
      <main id="main-content" className="site-canvas inner-canvas">
        <div className="landing-hero inner-hero-container">
          <PageHero
            title="Checkout"
            subtitle="Complete your delivery address and payment details."
            badge="Ordering Information"
          />

          <article className="checkout-container">
            <div className="empty-cart-card text-center py-12">
              <div className="empty-cart-icon text-brand-maroon flex justify-center mb-4">
                <ShoppingBag size={48} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your shopping bag is currently empty</h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Add Little Lambs activity books to your cart before proceeding to checkout.
              </p>
              <div className="flex justify-center">
                <Link href="/books" className="primary-cta font-bold">
                  Browse Books <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </article>

          <Footer inner />
        </div>
      </main>
    );
  }

  const addresses = await getUserAddresses(session.user.id);
  const shippingPaise = calculateShippingPaise(cart.subtotalPaise);
  const totalPaise = cart.subtotalPaise + shippingPaise;

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="Checkout"
          subtitle="Select your delivery address and place your order."
          badge="Secure Checkout"
        />

        <article className="checkout-container">
          <CheckoutForm
            cart={cart}
            initialAddresses={addresses}
            shippingPaise={shippingPaise}
            subtotalPaise={cart.subtotalPaise}
            totalPaise={totalPaise}
          />
        </article>

        <Footer inner />
      </div>
    </main>
  );
}
