import { auth } from '@/app/lib/auth/server';

export default auth.middleware({
  loginUrl: '/auth/sign-in',
});

export const config = {
  matcher: [
    '/',
    '/tasks/:path*',
    '/account/:path*',
  ],
};
