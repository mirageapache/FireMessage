import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Cookies from 'universal-cookie';

export function middleware(request: NextRequest) {
  const cookies = new Cookies(request.headers.get('cookie'));
  const token = cookies.get('UAT');
  const { pathname } = request.nextUrl;
  const isPublicPath = ['/', '/login', '/register'].includes(pathname);

  const hasToken = token !== undefined && token !== null && token !== '';

  if (hasToken && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/profile',
    '/userProfile/:path*',
    '/friend',
    '/search',
    '/setting',
    '/notification',
    '/chat',
  ],
};
