"use client";

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Product, Category } from '@/types/commerce';
import { productSchema, type ProductInput } from './validation';
import { saveProduct, archiveProduct } from './actions';
import { ImageUpload } from '@/components/image-upload';
import { useAdminLanguage } from '@/features/i18n/language-context';
import { getLocalizedCategoryName } from '@/lib/category-i18n';

export function ProductEditor({
  product: p,
  categories
}: {
  product: Product | null;
  categories: Category[];
}) {
  const router = useRouter();
  const { locale, dir } = useAdminLanguage();
  const [error, setError] = useState('');
  const [archive, setArchive] = useState(false);
  const [images, setImages] = useState(
    (p?.product_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => ({
        image_url: i.image_url,
        alt_text: i.alt_text || '',
        sort_order: i.sort_order
      }))
  );
  const [variants, setVariants] = useState(
    (p?.product_variants || []).map((v) => ({ ...v, sku: v.sku || '' }))
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: p?.name || '',
      slug: p?.slug || '',
      category_id: p?.category_id || '',
      sku: p?.sku || '',
      price: p?.price || 0,
      compare_at_price: p?.compare_at_price ?? null,
      stock_quantity: p?.stock_quantity || 0,
      track_inventory: p?.track_inventory ?? true,
      is_active: p?.is_active ?? false,
      is_featured: p?.is_featured ?? false,
      is_best_seller: p?.is_best_seller ?? false,
      short_description: p?.short_description || '',
      description: p?.description || '',
      ingredients: p?.ingredients || '',
      usage_instructions: p?.usage_instructions || '',
      benefits: p?.benefits || '',
      keywords: p?.keywords || '',
      seo_title: p?.seo_title || '',
      seo_description: p?.seo_description || ''
    }
  });

  async function submit(data: ProductInput) {
    setError('');
    try {
      const result = await saveProduct({
        id: p?.id || null,
        data,
        images: images.map((img, n) => ({ ...img, sort_order: n })),
        variants
      });
      if (result.error) setError(result.error);
      else {
        router.push('/products');
        router.refresh();
      }
    } catch {
      setError(
        locale === 'ar'
          ? 'تعذر حفظ المنتج. يرجى إعادة المحاولة.'
          : 'Enregistrement impossible. Réessayez.'
      );
    }
  }

  const values = useWatch({ control });
  const completion = [
    [locale === 'ar' ? 'الاسم' : 'Nom', (values.name?.trim().length ?? 0) >= 2],
    [locale === 'ar' ? 'التصنيف' : 'Catégorie', Boolean(values.category_id)],
    [locale === 'ar' ? 'الصور' : 'Image', images.length > 0],
    [locale === 'ar' ? 'السعر' : 'Prix', (values.price ?? 0) > 0],
    [locale === 'ar' ? 'المخزون' : 'Stock', !values.track_inventory || (values.stock_quantity ?? 0) > 0],
    [locale === 'ar' ? 'الوصف' : 'Description', Boolean(values.description?.trim())]
  ] as const;

  const fields = [
    ['name', locale === 'ar' ? 'اسم المنتج' : 'Nom du produit'],
    ['slug', 'Slug'],
    ['sku', 'SKU'],
    ['short_description', locale === 'ar' ? 'وصف قصير' : 'Description courte'],
    ['keywords', locale === 'ar' ? 'الكلمات المفتاحية' : 'Mots-clés'],
    ['seo_title', locale === 'ar' ? 'عنوان SEO' : 'Titre SEO'],
    ['seo_description', locale === 'ar' ? 'وصف SEO' : 'Description SEO']
  ] as const;

  return (
    <form onSubmit={handleSubmit(submit)} dir={dir}>
      <div className="detail-grid">
        <div>
          <section className="card">
            <h2>{locale === 'ar' ? 'معلومات المنتج' : 'Informations du produit'}</h2>
            <div className="form-grid">
              {fields.map(([name, label]) => (
                <div key={name}>
                  <label htmlFor={name}>{label}</label>
                  <input id={name} {...register(name)} />
                  {errors[name] && <small className="field-error">{errors[name]?.message}</small>}
                </div>
              ))}
              <div>
                <label htmlFor="category">
                  {locale === 'ar' ? 'التصنيف' : 'Catégorie'}
                </label>
                <select id="category" {...register('category_id')}>
                  <option value="">
                    {locale === 'ar' ? 'بدون تصنيف' : 'Sans catégorie'}
                  </option>
                  {categories.map((c) => (
                    <option value={c.id} key={c.id}>
                      {getLocalizedCategoryName(c.name, locale)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {[
              ['description', locale === 'ar' ? 'الوصف الكامل' : 'Description'],
              ['ingredients', locale === 'ar' ? 'المكونات' : 'Ingrédients'],
              ['usage_instructions', locale === 'ar' ? 'طريقة الاستعمال' : 'Conseils d’utilisation'],
              ['benefits', locale === 'ar' ? 'الفوائد والنتائج' : 'Bénéfices']
            ].map(([name, label]) => (
              <div key={name}>
                <label htmlFor={name}>{label}</label>
                <textarea id={name} {...register(name as keyof ProductInput)} />
              </div>
            ))}
          </section>

          <section className="card">
            <h2>{locale === 'ar' ? 'الصور الفوتوغرافية' : 'Photographies'}</h2>
            <p>
              {locale === 'ar'
                ? 'الصورة الأولى هي الصورة الرئيسية المستخدمة في المتجر والبطاقات.'
                : 'La première image est utilisée sur la fiche de collection.'}
            </p>
            <div className="image-list">
              {images.map((image, i) => (
                <div className="image-row" key={image.image_url}>
                  <Image src={image.image_url} alt={image.alt_text} width={70} height={80} />
                  <div>
                    <label>
                      {locale === 'ar' ? 'النص البديل (Alt)' : 'Texte alternatif'}
                      <input
                        value={image.alt_text}
                        onChange={(e) =>
                          setImages(
                            images.map((im, n) => (n === i ? { ...im, alt_text: e.target.value } : im))
                          )
                        }
                      />
                    </label>
                    <div className="inline">
                      <button
                        type="button"
                        className="text-button"
                        disabled={i === 0}
                        onClick={() => {
                          const copy = [...images];
                          [copy[i - 1], copy[i]] = [copy[i], copy[i - 1]];
                          setImages(copy);
                        }}
                      >
                        {locale === 'ar' ? 'للأعلى' : 'Monter'}
                      </button>
                      <button
                        type="button"
                        className="text-button"
                        disabled={i === images.length - 1}
                        onClick={() => {
                          const copy = [...images];
                          [copy[i + 1], copy[i]] = [copy[i], copy[i + 1]];
                          setImages(copy);
                        }}
                      >
                        {locale === 'ar' ? 'للأسفل' : 'Descendre'}
                      </button>
                      <button
                        type="button"
                        className="text-button danger"
                        onClick={() => setImages(images.filter((_, n) => n !== i))}
                      >
                        {locale === 'ar' ? 'حذف' : 'Retirer'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {images.length < 12 && (
              <ImageUpload
                bucket="products"
                onUpload={(url) =>
                  setImages([...images, { image_url: url, alt_text: '', sort_order: images.length }])
                }
              />
            )}
          </section>

          <section className="card">
            <h2>{locale === 'ar' ? 'الخيارات والأحجام (الأنواع)' : 'Variantes'}</h2>
            <p>
              {locale === 'ar'
                ? 'الخيارات النشطة تحدد السعر والمخزون الخاص بكل حجم أو سعة.'
                : 'Les variantes actives remplacent le prix et le stock du produit lors de l’achat.'}
            </p>
            {variants.map((v, i) => (
              <div className="variant-row" key={v.id || i}>
                <label>
                  {locale === 'ar' ? 'الاسم' : 'Nom'}
                  <input
                    value={v.name}
                    onChange={(e) =>
                      setVariants(
                        variants.map((x, n) => (n === i ? { ...x, name: e.target.value } : x))
                      )
                    }
                  />
                </label>
                <label>
                  SKU
                  <input
                    value={v.sku || ''}
                    onChange={(e) =>
                      setVariants(
                        variants.map((x, n) => (n === i ? { ...x, sku: e.target.value } : x))
                      )
                    }
                  />
                </label>
                <label>
                  {locale === 'ar' ? 'السعر' : 'Prix'}
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={v.price}
                    onChange={(e) =>
                      setVariants(
                        variants.map((x, n) => (n === i ? { ...x, price: Number(e.target.value) } : x))
                      )
                    }
                  />
                </label>
                <label>
                  {locale === 'ar' ? 'المخزون' : 'Stock'}
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={v.stock_quantity}
                    onChange={(e) =>
                      setVariants(
                        variants.map((x, n) =>
                          n === i ? { ...x, stock_quantity: Number(e.target.value) } : x
                        )
                      )
                    }
                  />
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={v.is_active}
                    onChange={(e) =>
                      setVariants(
                        variants.map((x, n) => (n === i ? { ...x, is_active: e.target.checked } : x))
                      )
                    }
                  />
                  {locale === 'ar' ? 'نشط' : 'Active'}
                </label>
                <button
                  type="button"
                  className="text-button danger"
                  onClick={() => setVariants(variants.filter((_, n) => n !== i))}
                >
                  {locale === 'ar' ? 'حذف' : 'Retirer'}
                </button>
              </div>
            ))}
            <button
              className="button secondary small"
              type="button"
              onClick={() =>
                setVariants([
                  ...variants,
                  {
                    id: crypto.randomUUID(),
                    name: '',
                    sku: '',
                    price: 0,
                    stock_quantity: 0,
                    is_active: false
                  }
                ])
              }
            >
              {locale === 'ar' ? '+ إضافة خيار جديد' : 'Ajouter une variante'}
            </button>
          </section>
        </div>

        <aside>
          <section className="card">
            <h2>{locale === 'ar' ? 'اكتمال بيانات المنتج' : 'Complétude du produit'}</h2>
            <ul>
              {completion.map(([label, complete]) => (
                <li key={label}>
                  {complete ? '✓' : '✕'} {label}
                </li>
              ))}
            </ul>
            <p>
              {locale === 'ar'
                ? 'يرجى إكمال جميع الحقول قبل النشر في المتجر. المخزون 0 يشير إلى نفاد الكمية.'
                : 'Complétez les informations avant publication. Un stock nul indique une rupture de stock.'}
            </p>
          </section>

          <section className="card">
            <h2>{locale === 'ar' ? 'السعر والمخزون' : 'Prix & stock'}</h2>
            <label htmlFor="price">{locale === 'ar' ? 'السعر (درهم)' : 'Prix (MAD)'}</label>
            <input id="price" type="number" step="0.01" min="0" {...register('price', { valueAsNumber: true })} />

            <label htmlFor="compare">
              {locale === 'ar' ? 'السعر القديم المشطوب (اختياري)' : 'Prix barré (facultatif)'}
            </label>
            <input
              id="compare"
              type="number"
              step="0.01"
              {...register('compare_at_price', {
                setValueAs: (v) => (v === '' ? null : Number(v))
              })}
            />

            <label htmlFor="stock">{locale === 'ar' ? 'المخزون المتوفر' : 'Stock disponible'}</label>
            <input
              id="stock"
              type="number"
              step="1"
              min="0"
              {...register('stock_quantity', { valueAsNumber: true })}
            />

            {[
              ['track_inventory', locale === 'ar' ? 'تتبع المخزون تلقائياً' : 'Suivre le stock'],
              ['is_active', locale === 'ar' ? 'معروض في المتجر للبيع' : 'Publié dans la boutique'],
              ['is_featured', locale === 'ar' ? 'مميز في الصفحة الرئيسية' : 'À la une'],
              ['is_best_seller', locale === 'ar' ? 'الأكثر طلباً (Best Seller)' : 'Essentiel / best seller']
            ].map(([name, label]) => (
              <label className="checkbox" key={name}>
                <input type="checkbox" {...register(name as keyof ProductInput)} />
                {label}
              </label>
            ))}
            <p className="notice">
              {locale === 'ar'
                ? 'تأكد من السعر، المكونات، الصور وكمية المخزون قبل نشر المنتج.'
                : 'Vérifiez le prix, la composition, les images et le stock avant publication.'}
            </p>
          </section>

          <section className="card">
            {Object.entries(errors).map(([key, val]) => (
              <p className="field-error" key={key}>
                {val?.message}
              </p>
            ))}
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="button" disabled={isSubmitting} style={{ width: '100%' }}>
              {isSubmitting
                ? locale === 'ar'
                  ? 'جاري الحفظ…'
                  : 'Enregistrement…'
                : locale === 'ar'
                ? 'حفظ المنتج'
                : 'Enregistrer le produit'}
            </button>
            {p && (
              <>
                <button
                  className="button secondary"
                  type="button"
                  disabled={isSubmitting}
                  style={{ marginTop: '10px' }}
                  onClick={handleSubmit((data) => submit({ ...data, is_active: true }))}
                >
                  {locale === 'ar' ? 'حفظ ونشر في المتجر' : 'Enregistrer et publier'}
                </button>
                <button
                  className="text-button danger"
                  style={{ marginTop: 20 }}
                  type="button"
                  onClick={() => setArchive(true)}
                >
                  {locale === 'ar' ? 'أرشفة المنتج' : 'Archiver le produit'}
                </button>
                {archive && (
                  <div className="notice" role="alert" style={{ marginTop: '12px' }}>
                    <p>
                      {locale === 'ar'
                        ? 'هل ترغب في سحب هذا المنتج من المتجر؟ ستبقى الطلبات السابقة محفوظة.'
                        : 'Retirer ce produit de la boutique ? Les commandes existantes sont conservées.'}
                    </p>
                    <button
                      type="button"
                      className="button small"
                      onClick={async () => {
                        const r = await archiveProduct(p.id);
                        if (r.error) setError(r.error);
                        else {
                          router.push('/products');
                          router.refresh();
                        }
                      }}
                    >
                      {locale === 'ar' ? 'أرشفة' : 'Archiver'}
                    </button>{' '}
                    <button type="button" className="text-button" onClick={() => setArchive(false)}>
                      {locale === 'ar' ? 'إلغاء' : 'Annuler'}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </aside>
      </div>
    </form>
  );
}
