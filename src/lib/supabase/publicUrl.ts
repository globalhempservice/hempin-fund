// src/lib/supabase/publicUrl.ts
import { createBrowserClient } from '@supabase/ssr';

/**
 * Get a public URL from your Supabase "assets" bucket.
 * Usage:
 *   const url = publicUrl('rewards/seed.webp')
 *   <img src={url} />
 */
export function publicUrl(path: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase env vars missing for publicUrl helper');
    return '';
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data } = supabase.storage.from('assets').getPublicUrl(path);
  return data?.publicUrl ?? '';
}