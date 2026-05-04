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
        Hey — I am Philip, a full-stack developer in Accra. I like problems where the UI, the data model, and the
        &quot;what happens when 10k people do this at once&quot; story all have to agree.
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-terminal-text/90 sm:text-base">
        Right now I am a Founding Engineer at Clubz, building social, real-time experiences with React Native, Convex,
        and LiveKit — the kind of product where latency is a feature, not an excuse.
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-terminal-text/90 sm:text-base">
        Before that I shipped campaign-tight Next.js work for clients (think dilli-dilli.com energy: fast iterations,
        crisp UI, no mystery deploys). I care about velocity, boringly reliable architecture, and outcomes you can
        point at — not buzzwords.
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-terminal-text/90 sm:text-base">
        Side quests include things like PulseNotes and Trackr: collaboration, roles, and pagination that does not
        pretend infinite lists are free.
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
