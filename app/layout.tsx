import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { env } from "@/lib/env";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Terminal Portfolio",
    template: "%s | Terminal Portfolio"
  },
  description: "A portfolio fed from GitHub topics and automated screenshots.",
  openGraph: {
    title: "Terminal Portfolio",
    description: "A portfolio fed from GitHub topics and automated screenshots.",
    url: "/",
    siteName: "Terminal Portfolio",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} bg-terminal-bg text-terminal-text`}>
        <div className="scanline fixed inset-0 pointer-events-none" />
        <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8">
          <header className="mb-8 flex flex-col gap-4 border-b border-terminal-border pb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-terminal-amber">terminal://portfolio-v2</p>
            <SiteNav />
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
