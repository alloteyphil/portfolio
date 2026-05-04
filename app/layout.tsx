import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist_Mono, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import { HeaderDrawers } from "@/components/header-drawers";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { SiteFooter } from "@/components/site-footer";
import { StructuredData } from "@/components/structured-data";
import { ThemeProvider } from "@/components/theme-provider";
import { env } from "@/lib/env";
import { themeInitScript } from "@/lib/theme-init-script";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Philip | Portfolio",
    template: "%s | Philip | Portfolio"
  },
  description:
    "Philip Allotey — full-stack developer (Next.js, React Native, real-time systems). Projects, stack, and contact.",
  openGraph: {
    title: "Philip | Portfolio",
    description:
      "Philip Allotey — full-stack developer (Next.js, React Native, real-time systems). Projects, stack, and contact.",
    url: "/",
    siteName: "Philip | Portfolio",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Philip | Portfolio",
    description:
      "Philip Allotey — full-stack developer (Next.js, React Native, real-time systems). Projects, stack, and contact."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${outfit.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <body className="overflow-x-hidden bg-terminal-bg font-mono text-terminal-text antialiased">
          <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          <StructuredData />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-terminal-accent focus:bg-terminal-panel focus:px-3 focus:py-2 focus:text-sm focus:text-terminal-accent focus:shadow-terminal focus:outline-none"
          >
            Skip to main content
          </a>
          <ThemeProvider>
            <KeyboardShortcuts />
            <div className="scanline pointer-events-none fixed inset-0" />
            <main className="mx-auto flex min-h-screen w-full min-w-0 max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8">
              <header className="mb-6 border-b border-terminal-border pb-5 sm:mb-8 sm:pb-6">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-outfit text-2xl font-semibold tracking-tight text-terminal-text sm:text-3xl">
                      <span className="text-terminal-text">Philip</span>
                      <span className="mx-1.5 font-light text-terminal-border sm:mx-2">|</span>
                      <span className="text-terminal-accent">Portfolio</span>
                    </p>
                  </div>
                  <HeaderDrawers />
                </div>
              </header>
              <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
                {children}
              </div>
              <SiteFooter />
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
