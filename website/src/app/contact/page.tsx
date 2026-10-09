export const dynamic = 'force-dynamic';

import { getContent } from '@/services/catalog';
import { ContactView } from '@/features/contact/contact-view';

export const metadata = {
  title: 'تواصل معنا · تعاونية سويت أركان',
  description:
    'تواصلي مع تعاونية سويت أركان بأكادير. استشارات جمالية مجانية، طلب عبر واتساب وخدمة العملاء.',
  alternates: { canonical: '/contact' }
};

export default async function Contact() {
  const c = await getContent();
  return (
    <ContactView
      whatsapp={c.whatsapp}
      contact_email={c.contact_email}
      instagram={c.instagram}
    />
  );
}
