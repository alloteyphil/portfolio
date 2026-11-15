import type { Metadata } from "next";
import Link from "next/link";
import { AccraClock } from "@/components/accra-clock";
import { ArrowUpRight, iconStroke } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SKILL_GROUPS } from "@/data/skills";

const DESCRIPTION =
  "Philip Allotey is a full-stack developer in Accra who builds web apps in TypeScript with Next.js and real-time backends.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  openGraph: { title: "About", description: DESCRIPTION, url: "/about" }
};

export default function AboutPage() {
  return (
    <>
      <PageHeader title="I like building the whole thing, database to browser." />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,40rem)_1fr] lg:gap-24">
        <div className="space-y-5 text-lg leading-relaxed text-ink/85">
          <p>
            I&apos;m a full-stack developer in Accra, Ghana. Almost everything I write is TypeScript: Next.js on the
            front, and whatever the backend needs to keep every screen in sync.
          </p>
          <p>
            The project I&apos;m proudest of is dilli-dilli.com, a site I built and launched for a New York restaurant
            and still maintain. In its first twelve months it went from 1,200 to more than 62,700 unique visitors,
            and it has been featured by the New York Times and Forbes.
          </p>
          <p>
            When I want to learn something properly I build a full product around it. Pulse Notes is where I worked
            out live presence, comment threads and revision history. Trackr is where I learned to page through a
            growing pile of transactions while the dashboard keeps updating.
          </p>
          <p>
            By day I&apos;m a junior analyst at Points Africa, where I work on monitoring: the dashboards, alerts and
            live health pages that show the team when something in the platform is going wrong. The projects on this
            site are what I build outside of that.
          </p>
          <p>
            <Link href="/projects" className="link font-semibold text-ink">
              See all the projects
            </Link>
          </p>
        </div>

        <aside className="text-[15px] leading-relaxed text-ink/80">
          <ul className="space-y-3 border-l-2 border-accent pl-5">
            <li>
              Accra, Ghana. It&apos;s <AccraClock className="font-semibold text-ink" /> here (GMT).
            </li>
            <li>BSc (Hons) Computing, De Montfort University, Leicester.</li>
            <li className="flex items-center gap-2.5">
              <span className="live-dot" aria-hidden />
              Open to freelance and contract projects.
            </li>
          </ul>
          <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-line mt-7">
            Résumé (PDF)
            <ArrowUpRight className="size-4" strokeWidth={iconStroke} aria-hidden />
          </Link>
        </aside>
      </div>

      <section id="tools" className="mt-24 scroll-mt-8 sm:mt-32" aria-labelledby="tools-heading">
        <Reveal as="h2" kind="sel" className="display pb-8 text-4xl text-heading sm:text-5xl">
          <span id="tools-heading" className="mark">
            What I use
          </span>
        </Reveal>
        <dl className="border-t border-line">
          {SKILL_GROUPS.map((group, i) => (
            <Reveal
              key={group.title}
              delay={i}
              className="grid gap-x-10 gap-y-1 border-b border-line py-5 sm:grid-cols-[11rem_1fr]"
            >
              <dt className="text-[15px] text-muted sm:pt-0.5">{group.title}</dt>
              <dd>
                <p className="text-lg font-medium text-ink">{group.items.join(", ")}</p>
                {group.note ? <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-ink/70">{group.note}</p> : null}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>
    </>
  );
}
