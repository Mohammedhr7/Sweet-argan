import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/features/cart/cart-provider';
import { CartDrawer } from '@/features/cart/cart-drawer';
import { LanguageProvider } from '@/features/i18n/language-context';
import { getContent, isPreview } from '@/services/catalog';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'سويت أركان — Sweet Argan | تعاونية مغربية',
    template: '%s | Sweet Argan'
  },
  description:
    'اكتشفوا عالم تعاونية سويت أركان: زيت أركان طبيعي بيولوجي، مستحضرات تجميل نقية وكنوز التراث المغربي الأصيل. Délices du terroir et soins naturels.',
  openGraph: {
    type: 'website',
    locale: 'ar_MA',
    siteName: 'Sweet Argan'
  },
  twitter: { card: 'summary_large_image' }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">
          الانتقال إلى المحتوى / Aller au contenu
        </a>
        <LanguageProvider>
          <CartProvider>
            {isPreview() && (
              <div className="preview-notice">
                Aperçu de développement · Catalogue et prix indicatifs · Commandes désactivées
              </div>
            )}
            <Header announcement={content.announcement} />
            <main id="main">{children}</main>
            <Footer content={content} />
            <CartDrawer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
