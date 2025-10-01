'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client.
 * Use inside Client Components and hooks.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}

// Optional aliases
export const createSupabaseBrowserClient = createClient;
export const createBrowserClientCompat = createClient;