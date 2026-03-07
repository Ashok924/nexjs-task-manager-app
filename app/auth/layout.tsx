import { redirect } from 'next/navigation';
import { auth } from '@/app/lib/auth/server';

export const dynamic = 'force-dynamic';

/**
 * Auth layout — centered full-screen for sign-in/sign-up.
 * Redirects already-authenticated users back to the dashboard.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = await auth.getSession();

  if (session) {
    redirect('/');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
      {children}
    </div>
  );
}

