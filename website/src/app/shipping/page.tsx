export const dynamic = 'force-dynamic';

import { getContent } from '@/services/catalog';
import { ShippingView } from '@/features/legal/shipping-view';

export const metadata = {
  title: 'الشحن والتوصيل · سويت أركان',
  description:
    'معلومات الشحن والتوصيل بالمغرب: 35 درهم سعر موحد، توصيل مجاني فوق 300 درهم، والدفع عند الاستلام خلال 24-48 ساعة.',
  alternates: { canonical: '/shipping' }
};

export default async function Page() {
  const content = await getContent();
  return (
    <ShippingView
      whatsapp={content.whatsapp}
      shipping_text={content.shipping_text}
    />
  );
}
