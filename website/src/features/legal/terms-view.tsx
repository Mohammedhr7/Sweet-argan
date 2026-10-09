'use client';

import Link from 'next/link';
import { useLanguage } from '@/features/i18n/language-context';

export function TermsView({ terms_text }: { terms_text: string }) {
  const { t, locale, dir } = useLanguage();

  const isAr = locale === 'ar';
  const isEn = locale === 'en';

  return (
    <div className="container section" dir={dir}>
      <div className="narrow">
        <div className="breadcrumbs">
          <Link href="/">{t.nav.home}</Link> /{' '}
          {isAr ? 'شروط البيع' : isEn ? 'Terms of Sale' : 'Conditions de vente'}
        </div>
        <div className="eyebrow">
          {isAr
            ? 'سويت أركان · الإطار القانوني والشفافية'
            : isEn
            ? 'SWEET ARGAN · LEGAL & TERMS'
            : 'SWEET ARGAN · CADRE LÉGAL & TRANSPARENCE'}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 45px)', marginBottom: 20 }}>
          {isAr ? 'الشروط العامة للبيع' : isEn ? 'Terms & Conditions' : 'Conditions Générales de Vente'}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 35 }}>
          {isAr
            ? 'آخر تحديث: 2026. بإتمام طلبكِ عبر موقع سويت أركان، فإنكِ توافقين على هذه الشروط المنظمة للمعاملات التجارية والدفع عند الاستلام.'
            : isEn
            ? 'Last updated: 2026. By placing an order with Sweet Argan, you accept these terms governing our commercial relationship.'
            : 'Dernière mise à jour : 2026. En passant commande sur la boutique en ligne Sweet Argan, vous acceptez sans réserve les présentes conditions régissant nos relations commerciales.'}
        </p>

        <div className="panel" style={{ marginBottom: 30 }}>
          <div className="prose">
            {isAr ? (
              <div>
                <p>
                  <strong>1. الطلبات والدفع عند الاستلام:</strong> تتم كافة الطلبات عبر الموقع بدون اشتراط أي دفع مسبق أو بطاقة بنكية. يتم الدفع نقداً بالدرهم المغربي عند استلام الطرد وفحصه مع الموزع.
                </p>
                <p>
                  <strong>2. التوصيل والشحن:</strong> يتم الشحن في غضون 24 إلى 48 ساعة لكافة المدن المغربية بتعريفة موحدة 35 درهم، ومجاناً للطلبات التي تفوق قيمتها 300 درهم.
                </p>
                <p>
                  <strong>3. حق الاسترجاع والاستبدال:</strong> يحق للزبون فحص المنتجات عند الاستلام، وإرجاع أي منتج به عيب تصنيع أو تلف خلال 7 أيام من تاريخ الاستلام في حالته وتغليفه الأصلي.
                </p>
              </div>
            ) : (
              terms_text
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/shop" className="button">
            {t.cart.explore}
          </Link>
          <Link href="/privacy" className="button secondary">
            {isAr ? 'سياسة الخصوصية' : isEn ? 'Privacy Policy' : 'Politique de confidentialité'}
          </Link>
          <Link href="/contact" className="text-link" style={{ alignSelf: 'center' }}>
            {isAr ? 'تواصل معنا في حال وجود أي سؤال' : 'Nous contacter en cas de question'}
          </Link>
        </div>
      </div>
    </div>
  );
}
