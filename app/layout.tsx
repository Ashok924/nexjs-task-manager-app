import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { authClient } from '@/app/lib/auth/client';
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-zinc-50 dark:bg-zinc-950 font-sans`}
      >
        {/* @ts-expect-error - Known internal type mismatch in neon sdk dependencies */}
        <NeonAuthUIProvider authClient={authClient} redirectTo="/" emailOTP>
          {children}
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}

