import { NextResponse } from 'next/server';
import { createServerClientSupabase } from '@/lib/supabase/server';

/**
 * DEV ONLY
 * Quick peek at the current user from server-side context.
 * Returns { user, error } — never cached.
 */
export async function GET() {
  try {
    const supabase = createServerClientSupabase();
    const { data, error } = await supabase.auth.getUser();

    const res = NextResponse.json({ user: data?.user ?? null, error: error ?? null });
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Vary', 'Cookie');
    return res;
  } catch (e: any) {
    return NextResponse.json({ user: null, error: e?.message ?? 'unknown' }, { status: 500 });
  }
}