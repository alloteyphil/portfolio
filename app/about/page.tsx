import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText, iconStroke } from "@/components/icons";
import { TerminalFrame } from "@/components/terminal-frame";
import { SKILL_GROUPS } from "@/data/skills";

export const metadata: Metadata = {
  title: "About",
  description:
    "Philip Allotey — Founding Engineer at Clubz, full-stack developer in Accra working in Next.js, React Native, Convex, and LiveKit.",
  openGraph: {
    title: "About",
    description:
      "Philip Allotey — Founding Engineer at Clubz, full-stack developer in Accra working in Next.js, React Native, Convex, and LiveKit.",
    url: "/about"
  }
};

export default function AboutPage() {
  return (
    <TerminalFrame title="~/about">
      <p className="text-terminal-accent">$ cat profile.txt</p>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-terminal-text/90 sm:text-base">
        I&apos;m Philip — a full-stack developer based in Accra, Ghana. I build across the stack: production web apps
        in Next.js and TypeScript, mobile apps in React Native (Expo), and backends designed to stay boring under
        load.
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-terminal-text/90 sm:text-base">
        As Founding Engineer at Clubz, I&apos;ve shipped real-time voice lounges, map-based location features,
        cross-community sharing, and invite flows in a live React Native app.
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-terminal-text/90 sm:text-base">
        Before that, I built and maintained dilli-dilli.com for a client — a Next.js platform that grew from 1,200 to
        over 62,700 cumulative unique users in 12 months, tracked via PostHog.
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-terminal-text/90 sm:text-base">
        I also build personal projects that go beyond tutorials: PulseNotes is a real-time collaborative notes app with
        workspace roles, live presence, revision history, and comment threads. Trackr is a personal finance tracker
        with paginated queries and analytics dashboards. I have a BSc in Computing from De Montfort University and
        I&apos;m actively looking for full-time or contract roles where I can ship things that matter.
      </p>

      <h2 id="skills" className="mt-10 scroll-mt-20 text-lg text-terminal-amber sm:scroll-mt-24">
        skills & tools
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-terminal-text/70">
        Grouped so it scales — add or trim entries in <span className="text-terminal-accent">data/skills.ts</span>.
      </p>

      <div className="mt-6 space-y-4">
        {SKILL_GROUPS.map((group) => (
          <section
            key={group.title}
            className="rounded-lg border border-terminal-border/70 bg-terminal-panel/40 px-3 py-3 sm:px-4"
          >
            <h3 className="text-sm font-medium text-terminal-accent">{group.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-terminal-border/70 bg-terminal-accent/5 px-2.5 py-1 text-xs text-terminal-text/90"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-terminal-text/75">
        Want the formal paper trail?{" "}
        <Link
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-terminal-amber underline underline-offset-2 hover:text-terminal-accent"
        >
          <FileText className="size-4 shrink-0" strokeWidth={iconStroke} aria-hidden />
          open resume (PDF)
          <ArrowUpRight className="size-3.5 shrink-0 opacity-80" strokeWidth={iconStroke} aria-hidden />
        </Link>
      </p>
    </TerminalFrame>
  );
}
