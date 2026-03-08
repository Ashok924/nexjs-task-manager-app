import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/app/lib/auth/server';

const neonAuthMiddleware = auth.middleware({
  loginUrl: '/auth/sign-in',
});

export default function middleware(req: NextRequest, event: any) {
  // Bypassing middleware for Next.js Server Actions 
  // because auth providers often block POSTs due to CSRF, but Next.js has its own CSRF.
  if (req.headers.has('next-action') || req.headers.has('x-action')) {
    return NextResponse.next();
  }
  
  return (neonAuthMiddleware as any)(req, event);
}

export const config = {
  matcher: [
    '/',
    '/tasks/:path*',
    '/account/:path*',
  ],
};
