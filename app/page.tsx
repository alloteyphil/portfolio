"use client";

import Link from "next/link";
import { TerminalFrame } from "@/components/terminal-frame";
import posthog from "posthog-js";

export default function HomePage() {
  return (
    <TerminalFrame title="~/home">
      <p className="typing max-w-max text-xl text-terminal-accent">$ whoami</p>
      <h1 className="mt-4 text-3xl font-semibold text-terminal-text">
        I am Philip Adotey Allotey, a full-stack developer focused on TypeScript.
      </h1>
      <p className="mt-4 max-w-3xl text-terminal-text/85">
        I build production web and mobile products with Next.js and React Native (Expo), with a strong focus on
        real-time systems using Convex. Recent work grew a client platform from
        <span className="text-terminal-amber"> 1,200 to 62,700+ cumulative unique users </span>
        in 12 months, tracked with PostHog.
      </p>
      <p className="mt-3 max-w-3xl text-terminal-text/85">
        This portfolio auto-syncs featured work from GitHub repos tagged with{" "}
        <span className="text-terminal-amber">portfolio</span>, then refreshes screenshots through ScreenshotOne and
        Cloudinary.
      </p>

      <div className="mt-8 flex gap-3 text-sm">
        <Link
          href="/projects"
          className="rounded border border-terminal-accent px-4 py-2 text-terminal-accent"
          onClick={() => posthog.capture("home_cta_clicked", { destination: "projects" })}
        >
          cd ~/projects
        </Link>
        <Link
          href="/about"
          className="rounded border border-terminal-amber px-4 py-2 text-terminal-amber"
          onClick={() => posthog.capture("home_cta_clicked", { destination: "about" })}
        >
          cat ~/about
        </Link>
      </div>
    </TerminalFrame>
  );
}
