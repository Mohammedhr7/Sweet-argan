export interface ManagedItem { product_id:string; variant_id:string|null; product_name:string; product_image_url:string|null; quantity:number; unit_price:number; line_total:number }
export interface ManagedOrder {
 public_order_code:string; customer_name:string; shipping_city:string; shipping_address:string; shipping_notes:string|null;
 subtotal:number;shipping_amount:number;discount_amount:number;total:number;confirmation_status:string;fulfillment_status:string;
 created_at:string;confirmed_at:string|null;editable_until:string|null;last_modified_at:string|null;cancelled_at:string|null;cancellation_reason:string|null;
 revision:number;server_now:string;remaining_seconds:number;can_modify:boolean;can_cancel:boolean;can_confirm:boolean;order_items:ManagedItem[];
 timeline:{status_type:string;new_status:string;created_at:string}[];
}
