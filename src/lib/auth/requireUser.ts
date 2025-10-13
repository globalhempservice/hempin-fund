// src/lib/auth/requireUser.ts (fund)
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClientReadOnly } from '@/lib/supabase/server';

/**
 * Server-only guard for protected pages.
 * - If a user is signed in, returns the user.
 * - If not, redirects to auth.hempin.org/login with an absolute `next`.
 */
export async function requireUser(nextPath: string = '/') {
  const supabase = createServerClientReadOnly();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) return user;

  const h = headers();
  const host  = h.get('x-forwarded-host') || h.get('host') || '';
  const proto = h.get('x-forwarded-proto') || 'https';
  const path  = nextPath.startsWith('/') ? nextPath : `/${nextPath}`;
  const absNext = `${proto}://${host}${path}`;

  redirect(`https://auth.hempin.org/login?next=${encodeURIComponent(absNext)}`);
}