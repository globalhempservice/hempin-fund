import { cookies } from 'next/headers';
import {
  createServerClient as createSsrClient,
  type CookieOptions,
} from '@supabase/ssr';

/**
 * In production we set parent-domain cookies so the session is shared across *.hempin.org.
 * In development (localhost) we must NOT set a cross-site domain; use host-only cookies.
 */
const PARENT_DOMAIN = '.hempin.org';
const SUPABASE_URL =
  process.env.SUPABASE_URL || (process.env.NEXT_PUBLIC_SUPABASE_URL as string);
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);

function withDefaults(opts?: Partial<CookieOptions>): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production';

  // Host-only cookies on localhost (no domain, no SameSite=None/Secure requirement)
  if (!isProd) {
    return {
      path: '/',
      httpOnly: true,
      // leave sameSite/secure undefined so browsers accept on http://localhost
      ...(opts || {}),
    };
  }

  // Cross-subdomain cookies in production
  return {
    domain: PARENT_DOMAIN,
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    ...(opts || {}),
  };
}

export function createServerClientSupabase() {
  const store = cookies();
  return createSsrClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name) {
        return store.get(name)?.value;
      },
      set(name, value, options) {
        store.set({ name, value, ...withDefaults(options) });
      },
      remove(name, options) {
        store.set({
          name,
          value: '',
          ...withDefaults({ ...(options || {}), expires: new Date(0) }),
        });
      },
    },
  });
}

// Back-compat alias (optional)
export const createServerClient = createServerClientSupabase;