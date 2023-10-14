import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const isLogin = request.cookies.get('token');
  if (!isLogin) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
      // return NextResponse.rewrite(new URL('/auth/login', request.url));
    }
  } else {
    if (url.pathname === '/') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }
}
