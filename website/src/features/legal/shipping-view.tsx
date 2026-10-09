'use client';

import Link from 'next/link';
import { Package, Truck, Clock, ShieldCheck, MapPin, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/features/i18n/language-context';

export function ShippingView({
  whatsapp,
  shipping_text
}: {
  whatsapp: string;
  shipping_text: string;
}) {
  const { t, locale, dir } = useLanguage();

  const isAr = locale === 'ar';
  const isEn = locale === 'en';

  return (
    <div className="container section" dir={dir}>
      <div className="narrow">
        <div className="eyebrow">
          {isAr
            ? 'سويت أركان · الشحن والتوصيل بالمغرب'
            : isEn
            ? 'SWEET ARGAN · SHIPPING & DELIVERY'
            : 'SWEET ARGAN · LIVRAISON & EXPÉDITION AU MAROC'}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 46px)', marginBottom: 20 }}>
          {isAr ? 'التوصيل لكافة مدن وقرى المغرب' : isEn ? 'Nationwide Delivery in Morocco' : 'Livraison partout au Maroc'}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 35, color: 'var(--foreground)' }}>
          {isAr
            ? 'تُجهز كافة طلباتكم بعناية تامة في ورشتنا بأكادير، وتُسلّم لموزعينا المعتمدين لضمان وصول سريع وموثوق يداً بيد مع الدفع عند الاستلام.'
            : isEn
            ? 'All packages are packed with care directly at our Agadir workshop and dispatched with certified courier partners for fast, secure delivery with cash on arrival.'
            : 'Tous vos colis sont conditionnés avec le plus grand soin directement à notre coopérative à Agadir, puis confiés à nos transporteurs partenaires agréés pour une remise en main propre rapide et sécurisée.'}
        </p>

        {/* HIGHLIGHT BOXES */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 40
          }}
        >
          <div className="panel" style={{ padding: 20, textAlign: 'center' }}>
            <Truck size={28} color="#927b4f" style={{ margin: '0 auto 10px' }} />
            <strong style={{ fontSize: 18 }}>{isAr ? '35 درهم فقط' : '35 MAD'}</strong>
            <small style={{ display: 'block', color: 'var(--muted)', marginTop: 4 }}>
              {isAr ? 'للطلبات الأقل من 300 درهم' : 'Pour les commandes de moins de 300 MAD'}
            </small>
          </div>
          <div className="panel" style={{ padding: 20, textAlign: 'center', background: '#f5f0e6' }}>
            <Package size={28} color="#354333" style={{ margin: '0 auto 10px' }} />
            <strong style={{ color: '#354333', fontSize: 18 }}>
              {isAr ? 'توصيل مجاني' : 'Livraison OFFERTE'}
            </strong>
            <small style={{ display: 'block', color: 'var(--muted)', marginTop: 4 }}>
              {isAr ? 'ابتداءً من 300 درهم في السلة' : 'Dès 300 MAD d\'achat dans votre panier'}
            </small>
          </div>
          <div className="panel" style={{ padding: 20, textAlign: 'center' }}>
            <Clock size={28} color="#927b4f" style={{ margin: '0 auto 10px' }} />
            <strong style={{ fontSize: 18 }}>{isAr ? '24 إلى 48 ساعة' : '24h à 48h'}</strong>
            <small style={{ display: 'block', color: 'var(--muted)', marginTop: 4 }}>
              {isAr ? 'في جميع المدن الرئيسية للمملكة' : 'Dans toutes les grandes villes du Royaume'}
            </small>
          </div>
        </div>

        {/* DETAILED CONTENT */}
        <div className="panel" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>
            {isAr ? 'شروط وتفاصيل الشحن والتسليم' : isEn ? 'Shipping Details & Terms' : 'Détails et conditions d\'expédition'}
          </h2>
          <div className="prose">
            {isAr ? (
              <p>
                يتم تأكيد الطلبات فور تسجيلها بالموقع والتواصل مع الزبون عبر الهاتف أو واتساب للتحقق من العنوان وتحديد موعد التسليم المناسب. في حالة وجود أي ملاحظات خاصة بالاستلام يرجى ذكرها عند الطلب.
              </p>
            ) : (
              shipping_text
            )}
          </div>
        </div>

        {/* PAYMENT COD NOTICE */}
        <div className="panel" style={{ background: '#f5f0e6', border: '1px solid #ded9cb', marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <ShieldCheck size={28} color="#354333" style={{ flexShrink: 0, marginTop: 4 }} />
            <div>
              <h3 style={{ fontSize: 19, margin: '0 0 8px' }}>
                {isAr ? 'الدفع نقداً 100% عند الاستلام' : isEn ? '100% Cash on Delivery' : 'Paiement 100% à la livraison'}
              </h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                {isAr
                  ? 'في سويت أركان، لا تطلب أي بطاقة بنكية أو دفع مسبق عبر الإنترنت. تقومين بالدفع نقداً بالدرهم المغربي مباشرة لموظف التوصيل عند تسلمكِ لطردكِ وفحصه.'
                  : isEn
                  ? 'At Sweet Argan, no credit card is required online. You hand cash directly to the courier agent upon arrival.'
                  : 'Chez Sweet Argan, vous ne payez rien lors de votre commande en ligne. Vous réglez directement le montant en espèces au livreur lors de la réception.'}
              </p>
            </div>
          </div>
        </div>

        {/* CITIES */}
        <div className="panel" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <MapPin size={22} color="#927b4f" />
            <h3 style={{ fontSize: 19, margin: 0 }}>
              {isAr ? 'المدن المشمولة بالتغطية' : isEn ? 'Covered Cities' : 'Villes desservies'}
            </h3>
          </div>
          <p style={{ fontSize: 14, margin: 0, lineHeight: 1.8 }}>
            {isAr
              ? 'توصيل يومي إلى: الدار البيضاء، الرباط، مراكش، أكادير، طنجة، فاس، مكناس، وجدة، تطوان، القنيطرة، سلا، المحمدية، الجديدة، آسفي، الصويرة، الناظور، بني ملال، خريبكة، العيون، الداخلة، وكافة الأقاليم والقرى المغربية.'
              : 'Casablanca, Rabat, Marrakech, Agadir, Tanger, Fès, Meknès, Oujda, Tétouan, Kenitra, Salé, Mohammédia, El Jadida, Safi, Essaouira, Nador, Béni Mellal, Khouribga, Laâyoune, Dakhla et toutes les localités du Maroc.'}
          </p>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/shop" className="button">
            {t.categories_section.view_all}
          </Link>
          <Link href="/order-tracking" className="button secondary">
            {isAr ? 'تتبع طلبيتي' : 'Suivre mon colis'}
          </Link>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'center' }}
            >
              <MessageCircle size={16} />
              {isAr ? 'استفسار عبر واتساب' : 'Une question sur la livraison ?'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
