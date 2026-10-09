import Link from 'next/link';
import {getPrivateOrder} from '@/services/orders';
import {OrderEditor} from '@/features/confirmation/order-editor';
export const dynamic='force-dynamic';
export const metadata={title:'Modifier votre commande',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default async function Edit({params}:{params:Promise<{publicOrderCode:string}>}){const o=await getPrivateOrder((await params).publicOrderCode);return <main className="container section"><div className="narrow">{o?.can_modify?<OrderEditor order={o}/>:<section className="panel"><h1>Modification indisponible</h1><p>{o?'Cette commande ne peut plus être modifiée ou annulée en ligne.':'Retrouvez votre commande avec votre numéro et votre téléphone.'}</p><Link className="button" href={o?'/order/'+o.public_order_code+'/confirmation':'/order-tracking'}>Retrouver ma commande</Link></section>}</div></main>;}
