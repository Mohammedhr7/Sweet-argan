export const dynamic = 'force-dynamic';

import { getContent } from '@/services/catalog';
import { AboutView } from '@/features/about/about-view';

export const metadata = {
  title: 'قصتنا · تعاونية سويت أركان',
  description:
    'تعرفي على قصة تعاونية سويت أركان في سوس، التزامنا بالجودة العالية، وتمكين المرأة القروية الصانعة للأركان.',
  alternates: { canonical: '/about' }
};

export default async function About() {
  const content = await getContent();
  return <AboutView instagram={content.instagram} />;
}
