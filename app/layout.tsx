import type {Metadata} from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';
import { ContactModal } from '@/components/ContactModal';
import { Footer } from '@/components/Footer';
import { AccessibilityWidget } from '@/components/AccessibilityWidget';

export const metadata: Metadata = {
  title: 'Squishy World | Premium Sensory Toys',
  description: 'The best colorful and sensory squishy toys for stress relief and fun.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="font-sans antialiased text-slate-800 bg-slate-50 overflow-x-hidden min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ContactModal />
          <AccessibilityWidget />
        </Providers>
      </body>
    </html>
  );
}