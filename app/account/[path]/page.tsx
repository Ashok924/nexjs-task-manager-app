import { AccountView } from '@neondatabase/auth/react';

export const dynamicParams = false;

export default async function AccountPage({
  params
}: {
  params: Promise<{ path: string }>
}) {
  const { path } = await params;
  return (
    <main className="container mx-auto flex grow flex-col items-center justify-start gap-3 self-center p-4 md:p-12 min-h-screen">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 md:p-10">
        <AccountView path={path} />
      </div>
    </main>
  );
}
