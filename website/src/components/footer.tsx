'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { SiteContent } from '@/types/commerce';
import { useLanguage } from '@/features/i18n/language-context';

export function Footer({ content }: { content: SiteContent }) {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="wordmark" style={{ marginBottom: 12 }}>
              <Image
                src="/assets/brand/logo.jpg"
                width={50}
                height={50}
                alt="Logo"
                style={{ borderRadius: '50%', border: '2px solid var(--gold)', background: '#fff' }}
              />
              <span>{t.brand.name}</span>
            </Link>
            <p>{t.footer.desc}</p>
          </div>

          <div>
            <h3>{t.footer.links_title}</h3>
            <Link href="/about">{t.nav.story}</Link>
            <Link href="/shop">{t.nav.shop}</Link>
            <Link href="/shop?best=1">{t.nav.bestsellers}</Link>
            <Link href="/contact">{t.nav.contact}</Link>
          </div>

          <div>
            <h3>{t.footer.legal_title}</h3>
            <Link href="/order-tracking">
              {t.locale === 'ar' ? 'تتبع طلبيتكِ' : t.locale === 'en' ? 'Track My Order' : 'Suivre ma commande'}
            </Link>
            <Link href="/shipping">
              {t.locale === 'ar' ? 'الشحن والتوصيل' : t.locale === 'en' ? 'Shipping & Delivery' : 'Livraison'}
            </Link>
            <Link href="/terms">
              {t.locale === 'ar' ? 'شروط البيع' : t.locale === 'en' ? 'Terms of Sale' : 'Conditions de vente'}
            </Link>
            <Link href="/privacy">
              {t.locale === 'ar' ? 'سياسة الخصوصية' : t.locale === 'en' ? 'Privacy Policy' : 'Confidentialité'}
            </Link>
          </div>

          <div>
            <h3>{t.footer.contact_title}</h3>
            <a href={content.instagram} target="_blank" rel="noopener noreferrer">
              Instagram @sweet_argan ↗
            </a>
            {content.whatsapp && (
              <a href={'https://wa.me/' + content.whatsapp.replace(/\D/g, '')} target="_blank" rel="noopener noreferrer">
                WhatsApp: {content.whatsapp} ↗
              </a>
            )}
            {content.contact_email && (
              <a href={'mailto:' + content.contact_email}>{content.contact_email}</a>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t.footer.rights}</span>
          <span>{t.brand.tagline} · Agadir, Maroc</span>
        </div>
      </div>
    </footer>
  );
}
