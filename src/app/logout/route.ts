import { redirect } from 'next/navigation';
import { createServerClientSupabase } from '@/lib/supabase/server';

/**
 * Logs the user out (clears .hempin.org httpOnly cookies)
 * and returns to the fund homepage.
 */
export async function GET() {
  try {
    const supabase = createServerClientSupabase();
    await supabase.auth.signOut(); // clears parent-domain cookies via server client
  } catch {
    // non-fatal — still redirect
  } finally {
    redirect('/'); // back to fund.hempin.org home
  }
}