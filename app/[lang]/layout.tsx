import '../globals.css';
import { notFound } from 'next/navigation';
import { Inter, Amiri } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata, Viewport } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { LOCALES, LOCALE_LIST, hasLocale } from '@/utils/i18n';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/utils/site';
import { graph, organizationSchema, websiteSchema } from '@/utils/schema';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const amiri = Amiri({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-amiri' });

// Site-wide defaults; each page overrides title/description/canonical via utils/seo.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} – Accurate Prayer Times Today`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['prayer times', 'namaz time', 'salah times', 'azan time', 'fajr time', 'maghrib time', 'sehri time', 'iftar time', 'islamic prayer times'],
  category: 'religion',
  formatDetection: { telephone: false },
  verification: {
    google: 'mnSi0fkHu5d4LL7obu2GNzyLmfITDChr41chVVF2iXc',
  },
};

export const viewport: Viewport = {
  themeColor: '#3D7760',
};

export function generateStaticParams() {
  return LOCALE_LIST.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} dir={LOCALES[lang].dir} className={`scroll-smooth ${inter.variable} ${amiri.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Deen" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className="bg-background dark:bg-[#061C14] text-charcoal dark:text-gray-100 font-sans antialiased selection:bg-primary-500 selection:text-white flex flex-col min-h-screen transition-colors duration-300 relative bg-cream-gradient dark:bg-none" suppressHydrationWarning>
        {/* Subtle background pattern overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('/pattern.svg')] bg-repeat z-0 mix-blend-multiply"></div>
        <JsonLd data={graph(organizationSchema(), websiteSchema(LOCALES[lang].hreflang))} />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
