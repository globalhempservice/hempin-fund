// Server-only Supabase admin client (service role)
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error('Supabase environment not configured');
  return createClient(url, key, { auth: { persistSession: false }, global: { headers: { 'X-Client-Info': 'fund-admin' } } });
}