"use client";
import { createContext,useContext,useState,useEffect,useRef,useCallback } from 'react';
import { z } from 'zod';
import { track } from '@/services/analytics';
const lineSchema=z.object({product_id:z.string().uuid(),variant_id:z.string().uuid().nullable(),name:z.string().max(200),slug:z.string().max(150),image:z.string().max(2000),price:z.number().nonnegative(),quantity:z.number().int().min(1).max(20)});
export type CartLine=z.infer<typeof lineSchema>;
type CartContextType={items:CartLine[];ready:boolean;add:(line:CartLine)=>void;update:(key:string,quantity:number)=>void;remove:(key:string)=>void;clear:()=>void;open:boolean;setOpen:(v:boolean)=>void;toast:string};
const Context=createContext<CartContextType|null>(null);
export const lineKey=(line:Pick<CartLine,'product_id'|'variant_id'>)=>line.product_id+':'+(line.variant_id||'');
const STORAGE='sweet-argan-cart-v1';
export function CartProvider({children}:{children:React.ReactNode}){
 const [items,setItems]=useState<CartLine[]>([]); const [ready,setReady]=useState(false);const [open,setOpen]=useState(false);const [toast,setToast]=useState('');const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{const load=()=>{try{const parsed=z.array(lineSchema).max(30).safeParse(JSON.parse(localStorage.getItem(STORAGE)||'[]'));setItems(parsed.success?parsed.data:[]);}catch{setItems([]);}setReady(true);};load();window.addEventListener('storage',load);return()=>{window.removeEventListener('storage',load);if(timer.current)clearTimeout(timer.current);};},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(STORAGE,JSON.stringify(items));}catch{/* Cart still works when storage is unavailable. */}},[items,ready]);
 const add=(line:CartLine)=>{setItems(current=>{const exists=current.find(i=>lineKey(i)===lineKey(line));return exists?current.map(i=>lineKey(i)===lineKey(line)?{...i,quantity:Math.min(20,i.quantity+line.quantity)}:i):current.length<30?[...current,line]:current;});setToast('Produit ajouté au panier');if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setToast(''),3000);track('add_to_cart',{product_id:line.product_id,quantity:line.quantity});};
 const clear=useCallback(()=>setItems([]),[]);
 return <Context.Provider value={{items,ready,add,update:(key,quantity)=>setItems(current=>current.map(i=>lineKey(i)===key?{...i,quantity:Math.max(1,Math.min(20,quantity))}:i)),remove:key=>setItems(current=>current.filter(i=>lineKey(i)!==key)),clear,open,setOpen,toast}}>{children}{toast&&<div role="status" className="toast">{toast}</div>}</Context.Provider>;
}
export function useCart(){const value=useContext(Context);if(!value)throw new Error('CartProvider missing');return value;}
