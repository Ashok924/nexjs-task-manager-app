import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "./components/ui/Sidebar";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorFallback } from "./components/ui/GlobalErrorFallback";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A modern, beautiful task manager application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex bg-zinc-50 dark:bg-zinc-950 font-sans overflow-hidden`}
      >
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full h-full">
              <Providers>
                <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
                  {children}
                </ErrorBoundary>
                <Toaster position="top-right" richColors />
              </Providers>
            </div>
          </main>

          <footer className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800/80 dark:bg-zinc-950 py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <p>© {new Date().getFullYear()} Task Manager. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
        </div>
      </body>
    </html>
  );
}
