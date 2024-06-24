import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  let token = req.cookies.get('token');
  const path = req.nextUrl.pathname;

  if (!token) {
    if (path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  } else {
    if (path.startsWith('/login') || path.startsWith('/register')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
}
