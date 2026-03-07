import { AuthView } from '@neondatabase/auth/react';

export const dynamicParams = false;

export default async function AuthPage({
  params
}: {
  params: Promise<{ path: string }>
}) {
  const { path } = await params;
  return (
    <div className="flex w-full h-full items-center justify-center p-4">
      <AuthView path={path} />
    </div>
  );
}
