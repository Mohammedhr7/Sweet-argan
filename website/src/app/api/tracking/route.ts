import { z } from 'zod';
import { phoneSchema,orderCodeSchema } from '@/features/checkout/validation';
import { serviceDb } from '@/lib/supabase/public';
import { checkOrigin,rateLimit,readJson,apiError,saveToken,newToken,hash } from '@/lib/security';
const schema=z.object({code:orderCodeSchema,phone:phoneSchema}).strict();
export async function POST(req:Request){try{
 checkOrigin(req); await rateLimit(req,'tracking',10);
 const input=schema.safeParse(await readJson(req)); if(!input.success)return Response.json({error:'Numéro de commande ou téléphone invalide.'},{status:400});
 await rateLimit(req,'tracking-order',5,input.data.code);
 const db=serviceDb(); const {data,error}=await db.from('orders').select('id,public_order_code,total,confirmation_status,fulfillment_status,created_at,order_items(product_name,quantity,line_total)').eq('public_order_code',input.data.code).eq('customer_phone',input.data.phone).maybeSingle();
 if(error||!data)return Response.json({error:'Aucune commande trouvée avec ces informations.'},{status:404});
 const token=newToken(); const update=await db.from('orders').update({access_token_hash:hash(token),access_expires_at:new Date(Date.now()+86400000).toISOString()}).eq('id',data.id);
 if(update.error)throw new Error('UNAVAILABLE'); await saveToken(data.public_order_code,token);
 const {data:safe,error:viewError}=await db.rpc('customer_order_view',{p_code:data.public_order_code,p_token_hash:hash(token)});if(viewError)throw new Error('UNAVAILABLE');
 return Response.json(safe,{headers:{'Cache-Control':'no-store'}});
}catch(error){return apiError(error);}}

