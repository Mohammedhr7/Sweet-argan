import 'server-only';
import { createHash, createHmac, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { serviceDb } from '@/lib/supabase/public';
export const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export const newToken = () => randomBytes(32).toString('hex');
export const tokenCookie = (code: string) => 'sa-order-' + code;
export async function saveToken(code: string, token: string) { (await cookies()).set(tokenCookie(code),token,{ httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:60*60*24*30 }); }
export async function readToken(code: string) { return (await cookies()).get(tokenCookie(code))?.value; }
export function checkOrigin(req: Request) {
 const origin=req.headers.get('origin');
 const expected=process.env.NEXT_PUBLIC_SITE_URL;
 if(!origin||!expected||origin!==new URL(expected).origin)throw new Error('FORBIDDEN');
}
export async function rateLimit(req:Request,scope:string,max=10,discriminator=''){
 const secret=process.env.RATE_LIMIT_SECRET;
 if(!secret||secret.length<32)throw new Error('SECURITY_CONFIGURATION');
 const ip=process.env.VERCEL?req.headers.get('x-vercel-forwarded-for')||'unknown':'local';
 const identity=createHmac('sha256',secret).update(scope+':'+ip+':'+discriminator).digest('hex');
 const {data,error}=await serviceDb().rpc('consume_rate_limit',{p_key:identity,p_max:max,p_seconds:900});
 if(error)throw new Error('RATE_LIMIT_UNAVAILABLE');
 if(!data)throw new Error('RATE_LIMIT');
}
export async function readJson(req: Request): Promise<unknown> {
 if (!req.headers.get('content-type')?.startsWith('application/json')) throw new Error('BAD_REQUEST');
 const reader=req.body?.getReader(); if(!reader) throw new Error('BAD_REQUEST');
 let bytes=0; const chunks:Uint8Array[]=[];
 while(true){ const {value,done}=await reader.read(); if(done)break; bytes+=value.length; if(bytes>32768){await reader.cancel();throw new Error('BAD_REQUEST');} chunks.push(value); }
 try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new Error('BAD_REQUEST'); }
}
export function apiError(error: unknown) {
 const message=error instanceof Error ? error.message : '';
 if(message==='RATE_LIMIT') return Response.json({error:'Trop de tentatives. Réessayez dans 15 minutes.'},{status:429});
 if(message==='FORBIDDEN')return Response.json({error:'Requête non autorisée.'},{status:403});
 if(message==='BAD_REQUEST')return Response.json({error:'Vérifiez les informations saisies.'},{status:400});
 return Response.json({error:'Le service est momentanément indisponible. Réessayez plus tard.'},{status:503});
}

