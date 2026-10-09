import 'server-only';
import {serviceDb} from '@/lib/supabase/public';
import {readToken,hash} from '@/lib/security';
import {orderCodeSchema} from '@/features/checkout/validation';
import type {ManagedOrder} from '@/types/order-management';
export async function getPrivateOrder(code:string):Promise<ManagedOrder|null>{
 if(!orderCodeSchema.safeParse(code).success)return null;
 const token=await readToken(code);if(!token)return null;
 const {data,error}=await serviceDb().rpc('customer_order_view',{p_code:code,p_token_hash:hash(token)});
 if(error){if(error.message.includes('INVALID_ACCESS'))return null;throw new Error('Commande indisponible. Réessayez.');}
 return data as ManagedOrder;
}
