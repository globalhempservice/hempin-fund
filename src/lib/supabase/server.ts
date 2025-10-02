// src/lib/supabase/server.ts
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

/**
 * Read/Write client — can SET/REMOVE cookies.
 * ✅ Use ONLY in Route Handlers or Server Actions.
 */
export function createServerClient() {
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

/**
 * Read-only client — NO cookie writes.
 * ✅ Use in Server Components (pages/layouts) to avoid the “Cookies can only be modified…” crash.
 */
export function createServerClientReadOnly() {
  const store = cookies();
  return createSsrClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name) {
        return store.get(name)?.value;
      },
      // No set/remove here on purpose.
    },
  });
}

// (Optional) back-compat alias if other files imported the old name:
export const createServerClientSupabase = createServerClient;