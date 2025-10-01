import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClientSupabase } from '@/lib/supabase/server';

/**
 * Server-only guard for protected pages.
 * - If a user is signed in, returns the user.
 * - If not, redirects to auth.hempin.org/login with a safe absolute `next`.
 *
 * Usage (at top of a Server Component/page):
 *   export default async function Page() {
 *     const user = await requireUser('/dashboard'); // optional next path
 *     return <div>Hello {user.email}</div>;
 *   }
 */
export async function requireUser(nextPath?: string) {
  const supabase = createServerClientSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) return user;

  // Build an absolute `next` from current request
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host') || '';
  const proto =
    h.get('x-forwarded-proto') ||
    (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https');

  // Normalize relative path input (default to current path if none)
  const reqPath =
    nextPath && nextPath.startsWith('/')
      ? nextPath
      : (() => {
          // Try to reconstruct current path (fallback '/')
          const url = h.get('x-pathname') || ''; // optional custom header if you set one
          return url.startsWith('/') ? url : '/';
        })();

  const absNext = `${proto}://${host}${reqPath}`;
  redirect(`https://auth.hempin.org/login?next=${encodeURIComponent(absNext)}`);
}