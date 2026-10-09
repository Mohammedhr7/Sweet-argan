import 'server-only';
import { createClient } from '@supabase/supabase-js';


export function publicDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Configuration Supabase manquante.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function serviceDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Service indisponible.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

