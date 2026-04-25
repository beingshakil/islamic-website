import './globals.css';
import { Inter, Amiri } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const amiri = Amiri({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-amiri' });

export const metadata = {
  title: 'PrayerTimes - Modern Islamic Portal',
  description: 'Comprehensive tools for your daily spiritual journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${amiri.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="bg-background dark:bg-[#061C14] text-charcoal dark:text-gray-100 font-sans antialiased selection:bg-primary-500 selection:text-white flex flex-col min-h-screen transition-colors duration-300 relative bg-cream-gradient dark:bg-none" suppressHydrationWarning>
        {/* Subtle background pattern overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('/pattern.png')] bg-repeat z-0 mix-blend-multiply"></div>
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
