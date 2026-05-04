import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist_Mono, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
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
          <ThemeProvider>
            <div className="scanline pointer-events-none fixed inset-0" />
            <main className="mx-auto min-h-screen w-full min-w-0 max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
              <header className="mb-6 border-b border-terminal-border pb-5 sm:mb-8 sm:pb-6">
                <div className="flex flex-col gap-4 sm:gap-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-outfit text-2xl font-semibold tracking-tight text-terminal-text sm:text-3xl">
                        <span className="text-terminal-text">Philip</span>
                        <span className="mx-1.5 font-light text-terminal-border sm:mx-2">|</span>
                        <span className="text-terminal-accent">Portfolio</span>
                      </p>
                    </div>
                    <div className="self-start md:self-auto">
                      <ThemeToggle />
                    </div>
                  </div>
                  <SiteNav />
                </div>
              </header>
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
