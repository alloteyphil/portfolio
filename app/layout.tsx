import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { ThemeProvider } from "@/components/theme-provider";
import { env } from "@/lib/env";
import { themeInitScript } from "@/lib/theme-init-script";

/** One family for everything. The width axis gives the expanded display cut (see `.display` in globals.css). */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap"
});

const SITE_TITLE = "Philip Allotey, full-stack developer in Accra";
const SITE_DESCRIPTION =
  "Philip Allotey builds web apps in TypeScript with Next.js and real-time backends. See the projects, all live, and get in touch.";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: SITE_TITLE,
    template: "%s | Philip Allotey"
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "Philip Allotey",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <body className="overflow-x-hidden bg-paper font-sans text-ink antialiased">
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <StructuredData />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-ink focus:shadow-soft"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <KeyboardShortcuts />
          <main className="mx-auto flex min-h-screen w-full min-w-0 max-w-page flex-col px-4 sm:px-8">
            <SiteHeader />
            <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </div>
            <SiteFooter />
          </main>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
