export const dynamic = 'force-dynamic';

import { getContent } from '@/services/catalog';
import { PrivacyView } from '@/features/legal/privacy-view';

export const metadata = {
  title: 'سياسة الخصوصية · سويت أركان',
  description:
    'حماية وسرية بياناتكم الشخصية لدى تعاونية سويت أركان وفقاً لمقتضيات القانون المغربي رقم 09-08.',
  alternates: { canonical: '/privacy' }
};

export default async function Page() {
  const content = await getContent();
  return <PrivacyView privacy_text={content.privacy_text} />;
}
