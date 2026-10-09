import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AdminLanguageProvider } from '@/features/i18n/language-context';

export const metadata: Metadata = {
  title: {
    default: 'سويت أرغان — لوحة التحكم | Sweet Argan Admin',
    template: '%s | Sweet Argan Admin',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AdminLanguageProvider>
          <a className="skip-link sr-only focus:not-sr-only" href="#main">
            الانتقال إلى المحتوى الرئيسي
          </a>
          {children}
        </AdminLanguageProvider>
      </body>
    </html>
  );
}
