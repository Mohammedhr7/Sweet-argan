import Link from 'next/link';
import {getPrivateOrder} from '@/services/orders';
import {getContent} from '@/services/catalog';
import {ManagedOrderPanel} from '@/features/confirmation/managed-order';
export const dynamic='force-dynamic';
export const metadata={title:'Votre commande',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default async function Confirmation({params}:{params:Promise<{publicOrderCode:string}>}){const o=await getPrivateOrder((await params).publicOrderCode);const content=await getContent();return <div className="container section"><div className="narrow">{o?<ManagedOrderPanel order={o} contact={content.contact_email?'/contact':undefined}/>:<div className="empty-state"><h1>Retrouvons votre commande.</h1><p>Utilisez votre numéro de commande et votre téléphone pour accéder à votre commande.</p><Link className="button" href="/order-tracking">Accéder au suivi</Link></div>}</div></div>;}
