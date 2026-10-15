import type { Metadata } from 'next';
import './globals.css';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloating from '@/components/layout/WhatsAppFloating';
import { SITE_NAME, TAGLINE, LOCATION, WHATSAPP_DISPLAY } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${SITE_NAME} | Fresh Handmade Cakes in Dera Ismail Khan`,
  description: `${TAGLINE}. Order custom birthday cakes, Korean bento cakes, fudgy brownies, and cupcakes online in Dera Ismail Khan, KP, Pakistan. Fast delivery & advance bookings.`,
  keywords: [
    'cakes in Dera Ismail Khan',
    'bakery in DI Khan',
    'custom birthday cake DI Khan',
    'bento cakes Dera Ismail Khan',
    'brownies delivery DI Khan',
    'Sweet Pearl Bakes',
    'home bakery Dera Ismail Khan'
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    title: `${SITE_NAME} | Artisanal Cakes & Treats in DI Khan`,
    description: `${TAGLINE}. Handmade customized cakes, bento cakes, cupcakes and brownies with online ordering in Dera Ismail Khan.`,
    url: 'https://sweetpearlbakes.com',
    siteName: SITE_NAME,
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: TAGLINE,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: SITE_NAME,
    image: 'https://sweetpearlbakes.com/logo.png',
    telephone: WHATSAPP_DISPLAY,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dera Ismail Khan',
      addressRegion: 'Khyber Pakhtunkhwa',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '31.8314',
      longitude: '70.9017',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: '10:00',
        closes: '22:00',
      },
    ],
    priceRange: 'PKR 950 - PKR 7500',
    servesCuisine: 'Bakery, Cakes, Desserts',
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FFF8ED] text-[#33241E] antialiased">
        {/* Skip to main content for keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[#3A2117] focus:text-[#FFF8ED] focus:px-4 focus:py-2 focus:rounded-md shadow-lg"
        >
          Skip to main content
        </a>

        <AnnouncementBar />
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
