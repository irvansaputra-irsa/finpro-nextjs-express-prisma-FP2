import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  let token = req.cookies.get('token');
  const path = req.nextUrl.pathname;

  if (!token) {
    if (path.includes('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
}

// export const config = {
//   matcher: ["/dashboard/:path*", "/about/:path*"],
// };
