import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Heart, Sparkles, ShieldCheck, Smile } from 'lucide-react';
import { getFeaturedBook, getAllActiveBooks } from '@/lib/books';
import BookCard from '@/components/books/BookCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StockBadge from '@/components/books/StockBadge';
import TornPaperDivider from '@/components/ui/TornPaperDivider';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const featuredBook = await getFeaturedBook();
  const allBooks = await getAllActiveBooks();

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-brand-cream pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
            {/* Hero Left Column: Editorial Headline & Copy */}
            <div className="md:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-maroon/20 bg-brand-paper px-4 py-1.5 text-xs font-semibold text-brand-maroon shadow-xs">
                <Sparkles className="h-4 w-4 text-brand-gold" />
                <span>English Christian Children&apos;s Activity Book Series</span>
              </div>

              <h1 className="font-heading text-4xl font-extrabold tracking-tight text-brand-maroon sm:text-5xl lg:text-6xl leading-[1.15]">
                Faith, Fun &amp; Creativity for Little Hearts
              </h1>

              <p className="text-lg text-brand-slate leading-relaxed max-w-2xl font-normal">
                Discover the Little Lambs book series — thoughtfully crafted activity books featuring inspiring Bible stories, guided prayers, engaging puzzles, colouring pages, and Christian games for children.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button href="/books" variant="primary" size="lg">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Our Books
                </Button>

                <Button href="#our-story" variant="outline" size="lg">
                  <Heart className="mr-2 h-5 w-5 text-brand-maroon" />
                  Our Story — SMYM Elanji
                </Button>
              </div>

              {/* Factual Series Highlights Pill Bar */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-brand-maroon/10 text-xs font-semibold text-brand-maroon">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>Ages 4–10 Years</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smile className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>Interactive Activities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>Made With Love</span>
                </div>
              </div>
            </div>

            {/* Hero Right Column: Official Cover Art Showcase */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border-2 border-brand-maroon/20 bg-brand-paper p-4 shadow-xl transition-transform duration-300 hover:rotate-1">
                <Image
                  src="/books/little-lambs-activity-book/cover-front.jpg"
                  alt="Little Lambs Christian Activity Book Official Cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 400px"
                  className="object-contain p-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selective Torn-Paper Transition */}
      <TornPaperDivider position="bottom" bgClass="bg-brand-cream" />

      {/* 2. FEATURED CURRENT BOOK SPOTLIGHT */}
      {featuredBook && (
        <section className="bg-brand-paper py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="accent">Featured Series Release</Badge>
              <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-bold text-brand-maroon">
                Current Published Volume
              </h2>
              <p className="mt-2 text-sm text-brand-slate">
                Explore the official activity book designed for children aged 4 to 10.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto rounded-3xl border border-brand-maroon/15 bg-brand-cream/40 p-6 sm:p-8 shadow-sm">
              <div className="md:col-span-5 flex justify-center">
                <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl bg-brand-paper p-3 shadow-md border border-brand-maroon/10">
                  <Image
                    src={featuredBook.coverImage || '/books/little-lambs-activity-book/cover-front.jpg'}
                    alt={featuredBook.title}
                    fill
                    sizes="300px"
                    className="object-contain p-2"
                  />
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">Ages {featuredBook.ageMin}–{featuredBook.ageMax}</Badge>
                  <StockBadge stock={featuredBook.stock} />
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-brand-maroon">
                  {featuredBook.title}
                </h3>
                {featuredBook.subtitle && (
                  <p className="text-sm font-semibold text-brand-maroon/80">
                    {featuredBook.subtitle}
                  </p>
                )}

                <p className="text-sm text-brand-slate leading-relaxed">
                  {featuredBook.description}
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-brand-maroon/10">
                  <div>
                    <span className="text-xs text-brand-slate uppercase font-semibold">Price</span>
                    <p className="font-heading text-3xl font-bold text-brand-maroon">
                      ₹{Number(featuredBook.price).toFixed(2)}
                    </p>
                  </div>

                  <Button href={`/books/${featuredBook.slug}`} variant="primary" size="md">
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. DISCOVER LITTLE LAMBS / WHAT MAKES IT SPECIAL */}
      <section id="about" className="bg-brand-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-maroon">
              What Makes Little Lambs Special?
            </h2>
            <p className="mt-2 text-sm text-brand-slate">
              Combining spiritual values with engaging, interactive activities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-brand-maroon/10 bg-brand-paper p-6 text-left shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-brand-sky/40 flex items-center justify-center text-brand-maroon mb-4 font-bold">
                📖
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-maroon">Bible Stories</h3>
              <p className="mt-2 text-xs text-brand-slate leading-relaxed">
                Simple, memorable scriptural narratives presented in child-friendly language.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-maroon/10 bg-brand-paper p-6 text-left shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-brand-gold/30 flex items-center justify-center text-brand-maroon mb-4 font-bold">
                🎨
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-maroon">Colouring Pages</h3>
              <p className="mt-2 text-xs text-brand-slate leading-relaxed">
                Beautifully illustrated line art for children to express their creativity.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-maroon/10 bg-brand-paper p-6 text-left shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-brand-sky/40 flex items-center justify-center text-brand-maroon mb-4 font-bold">
                🧩
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-maroon">Puzzles &amp; Games</h3>
              <p className="mt-2 text-xs text-brand-slate leading-relaxed">
                Crosswords, word searches, and fun mental exercises to reinforce lessons.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-maroon/10 bg-brand-paper p-6 text-left shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-brand-gold/30 flex items-center justify-center text-brand-maroon mb-4 font-bold">
                🙏
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-maroon">Prayers &amp; Faith</h3>
              <p className="mt-2 text-xs text-brand-slate leading-relaxed">
                Guided Christian prayers encouraging daily spiritual growth and reflection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR BOOKS (SERIES OVERVIEW) */}
      <section className="bg-brand-paper py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <Badge variant="secondary">Series Catalogue</Badge>
              <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-brand-maroon">
                Our Published Works
              </h2>
            </div>
            <Link
              href="/books"
              className="mt-4 md:mt-0 font-semibold text-sm text-brand-maroon hover:underline flex items-center gap-1"
            >
              <span>View All Titles</span> →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. MADE WITH LOVE / OUR STORY — SMYM ELANJI UNIT */}
      <section id="our-story" className="bg-brand-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-maroon/20 bg-brand-paper px-4 py-1 text-xs font-semibold text-brand-maroon">
              <Heart className="h-4 w-4 text-brand-maroon fill-brand-maroon/20" />
              <span>Made With Love</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-maroon">
              Our Story — SMYM Elanji Unit
            </h2>

            <p className="text-base text-brand-slate leading-relaxed">
              The <strong>Little Lambs</strong> series was born out of a shared vision to inspire Christian faith, creativity, and joy in young minds. Developed with dedication by the youth of the <strong>SMYM Elanji Unit</strong> and published by <strong>Pavanatma Publishers Pvt. Ltd. / Atma Books</strong>, every page is created with care for children and families.
            </p>

            <div className="pt-4 border-t border-brand-maroon/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="rounded-2xl bg-brand-paper p-5 border border-brand-maroon/10">
                <h3 className="font-heading font-bold text-brand-maroon">Publisher</h3>
                <p className="mt-1 text-xs text-brand-slate">
                  Pavanatma Publishers Pvt. Ltd. / Atma Books
                </p>
              </div>

              <div className="rounded-2xl bg-brand-paper p-5 border border-brand-maroon/10">
                <h3 className="font-heading font-bold text-brand-maroon">Initiative</h3>
                <p className="mt-1 text-xs text-brand-slate">
                  SMYM Elanji Unit — English Christian Activity Book Initiative
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL BOOKSTORE CTA */}
      <section id="contact" className="bg-brand-maroon py-16 text-brand-paper">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-paper">
            Explore the Little Lambs Series Today
          </h2>
          <p className="text-sm sm:text-base text-brand-paper/80 max-w-xl mx-auto">
            Discover our published activity book and stay connected as the series continues to grow.
          </p>
          <div>
            <Button href="/books" variant="secondary" size="lg">
              Browse Books Catalogue
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
