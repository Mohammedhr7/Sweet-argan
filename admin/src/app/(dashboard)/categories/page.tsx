import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import {
  LocalizedCategoryName,
  LocalizedCategoryDescription
} from '@/components/localized-category';

export default async function Categories() {
  const { db } = await requireAdmin();
  const { data, error } = await db.from('categories').select('*').order('sort_order');
  if (error) throw new Error('Catégories indisponibles.');

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">VOS UNIVERS</div>
          <h1>Catégories</h1>
        </div>
        <Link className="button" href="/categories/new">
          + Nouvelle catégorie
        </Link>
      </div>

      <div className="category-cards">
        {data?.map((c) => (
          <Link className="card" key={c.id} href={'/categories/' + c.id}>
            <span className={'badge ' + (c.is_active ? 'confirmed' : 'pending')}>
              {c.is_active ? 'Active' : 'Brouillon'}
            </span>
            <h2>
              <LocalizedCategoryName name={c.name} />
            </h2>
            <p>
              <LocalizedCategoryDescription name={c.name} fallback={c.description} />
            </p>
            <span className="text-button">Modifier →</span>
          </Link>
        ))}
      </div>

      {!data?.length && (
        <div className="empty-state">
          <h3>Organisez votre collection.</h3>
          <p>Créez votre première catégorie pour guider les clients.</p>
        </div>
      )}
    </>
  );
}
