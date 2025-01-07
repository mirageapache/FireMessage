import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Cookies from 'universal-cookie';

export function middleware(request: NextRequest) {
  const cookies = new Cookies(request.headers.get('cookie'));
  const token = cookies.get('UAT');

  if (!token) return NextResponse.redirect(new URL('/login', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
  ],
};
