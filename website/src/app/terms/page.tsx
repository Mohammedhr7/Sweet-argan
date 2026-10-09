export const dynamic = 'force-dynamic';

import { getContent } from '@/services/catalog';
import { TermsView } from '@/features/legal/terms-view';

export const metadata = {
  title: 'الشروط العامة للبيع · سويت أركان',
  description:
    'الشروط العامة للبيع لتعاونية سويت أركان: الدفع عند الاستلام بالمغرب، الشحن السريع وسياسة الاسترجاع.',
  alternates: { canonical: '/terms' }
};

export default async function Page() {
  const content = await getContent();
  return <TermsView terms_text={content.terms_text} />;
}
