import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard interactive pages (not /api/*)
  const needsAuth =
    pathname === '/pay' ||
    pathname.startsWith('/pledges');

  if (!needsAuth) return NextResponse.next();

  // Ask this app’s bootstrap API if the user is signed in.
  // Forward cookies so Supabase can read the .hempin.org session.
  let signedIn = false;
  try {
    const res = await fetch(new URL('/api/bootstrap', req.nextUrl.origin), {
      // Forward the incoming Cookie header to the API route
      headers: { cookie: req.headers.get('cookie') || '' },
      // Never cache auth checks
      cache: 'no-store',
      // Edge runtime cannot use credentials: 'include'; cookies are passed via header above
    });
    const json = await res.json();
    signedIn = Boolean(json?.ok && json?.signedIn);
  } catch {
    signedIn = false;
  }

  if (signedIn) return NextResponse.next();

  // Not signed in → send to auth hub with absolute next back here
  const login = new URL('https://auth.hempin.org/login');
  login.searchParams.set('next', req.nextUrl.toString());
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    '/pay',
    '/pledges/:path*',
  ],
};