import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkoutSchema,normalizePhone,phoneSchema } from '../src/features/checkout/validation';
import { classifyConfirmation } from '../src/features/confirmation/classify';
const valid={customer:{full_name:'Test Client',phone:'0612345678',city:'Agadir',address:'Adresse de test 123',email:'',notes:''},items:[{product_id:'20000000-0000-4000-8000-000000000001',quantity:2,variant_id:null}],idempotency_key:'30000000-0000-4000-8000-000000000001'};
test('checkout accepts valid guest details and normalizes Moroccan mobile phone',()=>{const result=checkoutSchema.parse(valid);assert.equal(result.customer.phone,'+212612345678');assert.equal(normalizePhone('00212 7 12 34 56 78'),'+212712345678');});
test('invalid phone, empty cart and invalid quantity are rejected',()=>{for(const phone of ['1234','+33612345678','0512345678','+2126123456789'])assert.equal(phoneSchema.safeParse(phone).success,false);assert.equal(checkoutSchema.safeParse({...valid,items:[]}).success,false);for(const quantity of [0,-1,1.5,21])assert.equal(checkoutSchema.safeParse({...valid,items:[{...valid.items[0],quantity}]}).success,false);});
test('client cannot submit price or total fields',()=>{assert.equal(checkoutSchema.safeParse({...valid,total:1}).success,false);assert.equal(checkoutSchema.safeParse({...valid,items:[{...valid.items[0],price:0}]}).success,false);});
test('only exact normalized confirmation words are accepted',()=>{for(const text of ['oui','OK','تأكيد','نعم','  confirmé  ','CONFIRMER'])assert.equal(classifyConfirmation(text),'confirmed',text);for(const text of ['oui mais changer adresse','ok?','random text','','oui non','no','yes please change'])assert.equal(classifyConfirmation(text),'needs_review',text);});
