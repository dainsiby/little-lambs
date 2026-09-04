import type { Metadata } from 'next';
import { Baloo_2, Nunito } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const baloo2 = Baloo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Little Lambs — Christian Children\'s Book Series',
    template: '%s | Little Lambs Store',
  },
  description:
    'Official online bookstore for the Little Lambs Christian children\'s book series. Inspiring faith, fun, and creativity for little hearts.',
  keywords: [
    'Little Lambs',
    'Christian Activity Book',
    'Children Bible Activity Book',
    'SMYM Elanji Unit',
    'Pavanatma Publishers',
  ],
  authors: [{ name: 'Pavanatma Publishers Pvt. Ltd. / Atma Books' }],
  openGraph: {
    title: 'Little Lambs — Christian Children\'s Book Series',
    description:
      'Official online bookstore for the Little Lambs Christian children\'s book series.',
    url: 'https://littlelambsstore.in',
    siteName: 'Little Lambs Store',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BookStore',
    name: 'Little Lambs Store',
    description:
      'Official digital bookstore for the Little Lambs Christian children\'s book series.',
    url: 'https://littlelambsstore.in',
    publisher: {
      '@type': 'Organization',
      name: 'Pavanatma Publishers Pvt. Ltd. / Atma Books',
    },
  };

  return (
    <html lang="en" className={`${baloo2.variable} ${nunito.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-brand-cream text-brand-maroon antialiased font-body">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
