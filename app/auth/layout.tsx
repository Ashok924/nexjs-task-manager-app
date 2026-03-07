/**
 * Auth layout — bypasses the root layout's header/footer/padding
 * so the sign-in form can be perfectly centered on a blank screen.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
      {children}
    </div>
  );
}
