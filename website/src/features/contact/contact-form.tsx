'use client';

import { useState } from 'react';
import { Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/features/i18n/language-context';

export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const { locale, dir } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const isAr = locale === 'ar';
  const isEn = locale === 'en';

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: isAr ? 'استشارة عناية مخصصة' : isEn ? 'Skincare advice' : 'Conseil soin personnalisé',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSubmitted(true);
    }, 400);
  };

  if (submitted) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '40px 24px' }} dir={dir}>
        <CheckCircle2 size={44} color="#354333" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: 24, marginBottom: 12 }}>
          {isAr ? 'تم استلام رسالتكِ بنجاح !' : isEn ? 'Message Received!' : 'Message bien reçu !'}
        </h3>
        <p style={{ maxWidth: 450, margin: '0 auto 24px' }}>
          {isAr
            ? `شكراً لكِ ${formData.name || 'عزيزتي'}. سيتواصل معكِ فريق التعاونية في أقرب وقت عبر ${formData.contact}.`
            : isEn
            ? `Thank you ${formData.name || 'dear customer'}. Our cooperative team will get back to you shortly at ${formData.contact}.`
            : `Merci ${formData.name || 'chère cliente'}. Notre équipe de la coopérative Sweet Argan vous répondra dans les plus brefs délais au ${formData.contact}.`}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '',
                contact: '',
                subject: isAr ? 'استشارة عناية مخصصة' : 'Conseil soin personnalisé',
                message: ''
              });
            }}
          >
            {isAr ? 'إرسال رسالة أخرى' : isEn ? 'Send another message' : 'Envoyer un autre message'}
          </button>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                isAr
                  ? `السلام عليكم سويت أركان، لدي استفسار: ${formData.message}`
                  : `Bonjour Sweet Argan, j'ai une question : ${formData.message}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              <MessageCircle size={16} />
              {isAr ? 'المتابعة عبر واتساب' : isEn ? 'Continue on WhatsApp' : 'Continuer sur WhatsApp'}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="panel" style={{ padding: 'clamp(20px, 4vw, 36px)' }} dir={dir}>
      <h3 style={{ fontSize: 24, marginBottom: 8 }}>
        {isAr ? 'أرسلي لنا استفساركِ' : isEn ? 'Get in Touch' : 'Écrivez-nous'}
      </h3>
      <p style={{ marginBottom: 24, fontSize: 13, color: 'var(--muted)' }}>
        {isAr
          ? 'استفسار عن تركيباتنا الطبيعية، طلبكِ، أو استشارة لنوع بشرتكِ؟ املئي هذا النموذج أو راسلينا مباشرة عبر واتساب.'
          : isEn
          ? 'Questions about our botanical formulas, orders, or skincare guidance? Fill this form or chat directly with our team on WhatsApp.'
          : 'Une question sur nos formules, une commande ou un conseil pour votre peau ? Remplissez ce formulaire ou écrivez-nous directement sur WhatsApp.'}
      </p>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="contact-name">
            {isAr ? 'الاسم الكامل *' : isEn ? 'Full Name *' : 'Votre nom complet *'}
          </label>
          <input
            id="contact-name"
            required
            type="text"
            placeholder={isAr ? 'مثال: أمينة بنعلي' : 'Ex : Amina Benali'}
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="contact-info">
            {isAr ? 'رقم الهاتف أو البريد الإلكتروني *' : isEn ? 'Phone or Email *' : 'Téléphone ou E-mail *'}
          </label>
          <input
            id="contact-info"
            required
            type="text"
            placeholder={isAr ? '06 61 XX XX XX أو amina@example.ma' : 'Ex : 06 61 XX XX XX ou amina@example.ma'}
            value={formData.contact}
            onChange={e => setFormData({ ...formData, contact: e.target.value })}
          />
        </div>

        <div className="field full">
          <label htmlFor="contact-subject">
            {isAr ? 'موضوع الاستفسار' : isEn ? 'Subject' : 'Objet de votre demande'}
          </label>
          <select
            id="contact-subject"
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          >
            <option value="Conseil soin personnalisé">
              {isAr ? 'استشارة مخصصة للبشرة' : isEn ? 'Custom skincare routine' : 'Conseil pour ma peau (soin personnalisé)'}
            </option>
            <option value="Question sur ma commande">
              {isAr ? 'متابعة أو تعديل طلبية' : isEn ? 'Order status or modification' : 'Suivi ou modification de commande'}
            </option>
            <option value="Information livraison">
              {isAr ? 'معلومات ومواعيد التوصيل' : isEn ? 'Shipping & delivery inquiry' : 'Délai et modalités de livraison'}
            </option>
            <option value="Coffret cadeau & Pack">
              {isAr ? 'باقات الهدايا وباك تيموموشين' : isEn ? 'Gift sets & Timomouchin' : 'Pack Timomouchin & Coffrets cadeaux'}
            </option>
            <option value="Autre demande">
              {isAr ? 'استفسار آخر' : isEn ? 'Other inquiry' : 'Autre demande'}
            </option>
          </select>
        </div>

        <div className="field full">
          <label htmlFor="contact-message">
            {isAr ? 'رسالتكِ بالتفصيل *' : isEn ? 'Your Message *' : 'Votre message *'}
          </label>
          <textarea
            id="contact-message"
            required
            rows={4}
            placeholder={
              isAr
                ? 'كيف يمكننا مساعدتكِ وتقديم النصح لكِ اليوم؟'
                : isEn
                ? 'How can we help your skincare journey today?'
                : 'Comment pouvons-nous vous aider aujourd’hui ?'
            }
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
          />
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="button" type="submit" disabled={busy}>
          <Send size={16} />
          {busy
            ? isAr
              ? 'جاري الإرسال…'
              : 'Envoi en cours…'
            : isAr
            ? 'إرسال الرسالة'
            : isEn
            ? 'Send Message'
            : 'Envoyer mon message'}
        </button>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          {isAr ? 'إجابة سريعة خلال ساعات قليلة' : isEn ? 'Fast reply within hours' : 'Réponse rapide sous quelques heures'}
        </span>
      </div>
    </form>
  );
}
