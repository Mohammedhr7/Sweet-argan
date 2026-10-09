'use client';

import Link from 'next/link';
import { useLanguage } from '@/features/i18n/language-context';

export function PrivacyView({ privacy_text }: { privacy_text: string }) {
  const { t, locale, dir } = useLanguage();

  const isAr = locale === 'ar';
  const isEn = locale === 'en';

  return (
    <div className="container section" dir={dir}>
      <div className="narrow">
        <div className="breadcrumbs">
          <Link href="/">{t.nav.home}</Link> /{' '}
          {isAr ? 'الخصوصية' : isEn ? 'Privacy' : 'Confidentialité'}
        </div>
        <div className="eyebrow">
          {isAr
            ? 'سويت أركان · حماية بياناتكِ وخصوصيتكِ'
            : isEn
            ? 'SWEET ARGAN · DATA PROTECTION'
            : 'SWEET ARGAN · PROTECTION DE VOS DONNÉES'}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 45px)', marginBottom: 20 }}>
          {isAr ? 'سياسة الخصوصية وحماية البيانات' : isEn ? 'Privacy Policy' : 'Politique de Confidentialité'}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 35 }}>
          {isAr
            ? 'تولي تعاونية سويت أركان أهمية قصوى لسرية وأمان بياناتكِ الشخصية وفقاً لمقتضيات القانون المغربي رقم 09-08.'
            : isEn
            ? 'Sweet Argan Cooperative places the highest value on the confidentiality and security of your personal data in accordance with Moroccan Law 09-08.'
            : 'La coopérative Sweet Argan accorde la plus haute importance à la sécurité et à la discrétion de vos données conformément à la loi 09-08.'}
        </p>

        <div className="panel" style={{ marginBottom: 30 }}>
          <div className="prose">
            {isAr ? (
              <div>
                <p>
                  <strong>1. جمع البيانات واستخدامها:</strong> نجمع فقط البيانات الضرورية لتوصيل طلبيتكِ (الاسم، الهاتف، المدينة، العنوان). لا يتم بيع أو مشاركة بياناتكِ مع أي طرف ثالث خارج إطار شركة التوصيل المعتمدة.
                </p>
                <p>
                  <strong>2. أمان المعلومات:</strong> تُحفظ كافة بيانات الزبائن في خوادم مشفرة ومحمية بأحدث معايير الأمان المعلوماتي.
                </p>
                <p>
                  <strong>3. حقوقكِ:</strong> يحق لكِ في أي وقت طلب تعديل أو حذف بياناتكِ عبر مراسلتنا مباشرة.
                </p>
              </div>
            ) : (
              privacy_text
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/shop" className="button">
            {t.cart.explore}
          </Link>
          <Link href="/terms" className="button secondary">
            {isAr ? 'شروط البيع' : isEn ? 'Terms of Sale' : 'Conditions de vente'}
          </Link>
          <Link href="/contact" className="text-link" style={{ alignSelf: 'center' }}>
            {isAr ? 'ممارسة حقوقكِ (تعديل / حذف البيانات)' : 'Exercer mes droits (accès / rectification)'}
          </Link>
        </div>
      </div>
    </div>
  );
}
