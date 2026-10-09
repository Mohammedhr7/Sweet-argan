export const dynamic='force-dynamic';
import { ShopView, type Filters } from '@/features/catalog/shop-view';
export const metadata={title:'La boutique',alternates:{canonical:'/shop'}};
export default async function Shop({searchParams}:{searchParams:Promise<Filters>}){return <ShopView filters={await searchParams}/>;}
