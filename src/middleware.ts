// middleware.ts (fund)
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Only guard interactive pages
const GUARDED = ['/pay', '/pledges'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run on guarded paths
  const isGuarded = GUARDED.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (!isGuarded) return NextResponse.next();

  // Supabase session cookies (set by auth.hempin.org on .hempin.org)
  const hasAccess = Boolean(
    req.cookies.get('sb-access-token') || req.cookies.get('sb:token')
  );
  if (hasAccess) return NextResponse.next();

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