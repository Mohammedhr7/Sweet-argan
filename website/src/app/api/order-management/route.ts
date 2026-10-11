import {z} from 'zod';
import {cartItemSchema,orderCodeSchema} from '@/features/checkout/validation';
import {serviceDb} from '@/lib/supabase/public';
import {checkOrigin,rateLimit,readJson,apiError,readToken,saveToken,hash} from '@/lib/security';
const schema=z.object({
  code:orderCodeSchema,
  action:z.enum(['confirm','modify','cancel']),
  revision:z.number().int().positive(),
  items:z.array(cartItemSchema).min(1).max(30).optional(),
  shipping:z.object({city:z.string().trim().min(2).max(100),address:z.string().trim().min(8).max(500),notes:z.string().max(1000)}).strict().optional(),
  reason:z.string().max(500).optional(),
  token:z.string().optional()
}).strict();
export async function POST(req:Request){try{
 checkOrigin(req);await rateLimit(req,'order-management',30);
 const parsed=schema.safeParse(await readJson(req));if(!parsed.success)return Response.json({error:'Vérifiez les produits et votre adresse (8 caractères minimum).'},{status:400});
 const p=parsed.data;const token=(await readToken(p.code))||p.token||req.headers.get('x-order-token');if(!token)return Response.json({error:'Accès expiré. Retrouvez votre commande avec votre téléphone.'},{status:403});
 const {data,error}=await serviceDb().rpc('manage_customer_order',{p_code:p.code,p_token_hash:hash(token),p_action:p.action,p_revision:p.revision,p_items:p.items??null,p_shipping:p.shipping??null,p_reason:p.reason??''});
 if(error){const messages:Record<string,string>={INVALID_ACCESS:'Accès expiré. Utilisez le suivi de commande.',STALE_ORDER:'Cette commande a changé. Actualisez la page avant de réessayer.',ORDER_LOCKED:'Cette commande ne peut plus être modifiée ou annulée en ligne.',OUT_OF_STOCK:'Le stock a changé. Réduisez la quantité ou retirez le produit.',UNAVAILABLE_PRODUCT:'Un produit n’est plus disponible. Modifiez votre sélection.',INVALID_CART:'Votre commande doit contenir au moins un produit.',VARIANT_REQUIRED:'Choisissez une variante pour ce produit.',CHECKOUT_DISABLED:'Les modifications sont momentanément indisponibles.'};const key=Object.keys(messages).find(k=>error.message.includes(k));return Response.json({error:key?messages[key]:'Modification impossible. Vérifiez votre commande.'},{status:error.message.includes('INVALID_ACCESS')?403:409});}
 if(p.token && !(await readToken(p.code))){ try{ await saveToken(p.code, p.token); }catch{} }
 return Response.json(data,{headers:{'Cache-Control':'no-store'}});
}catch(error){return apiError(error);}}

