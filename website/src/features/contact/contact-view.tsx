'use client';

import Link from 'next/link';
import { MessageCircle, Camera, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { ContactForm } from '@/features/contact/contact-form';
import { useLanguage } from '@/features/i18n/language-context';

export function ContactView({
  whatsapp,
  contact_email,
  instagram
}: {
  whatsapp: string;
  contact_email: string;
  instagram: string;
}) {
  const { t, locale, dir } = useLanguage();

  const isAr = locale === 'ar';
  const isEn = locale === 'en';

  return (
    <div className="container section" dir={dir}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="eyebrow">
          {isAr
            ? 'خدمة العملاء والاستشارات'
            : isEn
            ? 'CARE & ASSISTANCE'
            : 'UNE QUESTION, UNE ATTENTION'}
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 12 }}>
          {isAr ? 'تحدثي إلينا عن روتينكِ وجمالكِ.' : isEn ? 'Let’s Talk Skincare.' : 'Parlons de votre rituel.'}
        </h1>
        <p style={{ fontSize: 16, maxWidth: 650, marginBottom: 40, color: 'var(--muted)', lineHeight: 1.8 }}>
          {isAr
            ? 'يسعد فريقنا في تعاونية سويت أركان بإرشادكِ في اختيار أفضل مستحضرات الأركان المناسبة لبشرتكِ، ومساعدتكِ في تتبع طلباتكِ بكافة مدن المغرب.'
            : isEn
            ? 'Our cooperative team in Agadir is delighted to assist you in choosing the ideal botanical skincare and tracking your orders across Morocco.'
            : 'Notre équipe à la coopérative vous guide dans le choix de vos soins d’argan, vos idées cadeaux et le suivi de vos commandes partout au Maroc.'}
        </p>

        <div className="shop-layout" style={{ gridTemplateColumns: '1fr minmax(280px, 340px)', gap: 36 }}>
          {/* FORM */}
          <div>
            <ContactForm whatsapp={whatsapp} />
          </div>

          {/* SIDEBAR CHANNELS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* WHATSAPP CARD */}
            <div className="panel" style={{ background: '#f5f0e6', border: '1px solid #dcd7c9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <MessageCircle size={22} color="#354333" />
                <h3 style={{ fontSize: 18, margin: 0 }}>
                  {isAr ? 'واتساب المباشر' : isEn ? 'Direct WhatsApp' : 'WhatsApp Direct'}
                </h3>
              </div>
              <p style={{ fontSize: 13, marginBottom: 16 }}>
                {isAr
                  ? 'للإجابة الفورية أو تقديم طلبكِ مباشرة عبر رسالة واتساب:'
                  : isEn
                  ? 'For instant answers or to place your order directly via chat:'
                  : 'Pour une réponse immédiate ou passer commande directement en envoyant un message :'}
              </p>
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button"
                  style={{ width: '100%', fontSize: 13, textAlign: 'center' }}
                >
                  {isAr ? `محادثة واتساب (${whatsapp})` : `Ouvrir WhatsApp (${whatsapp})`}
                </a>
              )}
            </div>

            {/* DIRECT CONTACT INFO */}
            <div className="panel">
              <h3 style={{ fontSize: 18, marginBottom: 14 }}>
                {isAr ? 'معلومات الاتصال' : isEn ? 'Contact Info' : 'Nos coordonnées'}
              </h3>

              <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: 13 }}>
                <MapPin size={18} color="#927b4f" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>{t.brand.name}</strong>
                  <br />
                  {isAr ? 'جهة سوس ماسة، أكادير، المملكة المغربية' : 'Région Souss-Massa, Agadir, Maroc'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: 13 }}>
                <Clock size={18} color="#927b4f" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>{isAr ? 'أوقات العمل' : isEn ? 'Opening Hours' : 'Horaires du service client'}</strong>
                  <br />
                  {isAr ? 'من الإثنين إلى السبت: 9:00 صباحاً – 7:00 مساءً' : 'Du lundi au samedi : 9h00 – 19h00'}
                </div>
              </div>

              {contact_email && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: 13 }}>
                  <Mail size={18} color="#927b4f" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <a href={`mailto:${contact_email}`} className="text-link">
                      {contact_email}
                    </a>
                  </div>
                </div>
              )}

              {instagram && (
                <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                  <Camera size={18} color="#927b4f" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-link">
                      Instagram : @sweet_argan ↗
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* ORDER TRACKING SHORTCUT */}
            <div className="panel">
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>
                {isAr ? 'لديكِ طلب سابق؟' : isEn ? 'Already Ordered?' : 'Vous avez déjà commandé ?'}
              </h3>
              <p style={{ fontSize: 13, marginBottom: 16 }}>
                {isAr
                  ? 'تابعي حالة طردكِ وتاريخ تجهيزه خلال ثوانٍ معدودة.'
                  : isEn
                  ? 'Check your package status and dispatch timeline in seconds.'
                  : 'Consultez le statut de votre colis et votre historique en quelques secondes.'}
              </p>
              <Link
                href="/order-tracking"
                className="button secondary"
                style={{ width: '100%', fontSize: 13, textAlign: 'center' }}
              >
                {isAr ? 'تتبع طلبيتي' : isEn ? 'Track Order' : 'Suivre ma commande'}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
