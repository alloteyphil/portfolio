import Image from "next/image";
import Link from "next/link";
import { AccraClock } from "@/components/accra-clock";
import { GrowthBar } from "@/components/growth-bar";
import { ArrowUpRight, iconStroke } from "@/components/icons";
import { LiveHeadline } from "@/components/live-headline";
import { PresenceStage } from "@/components/presence-stage";
import { Reveal } from "@/components/reveal";
import { FEATURED_WORK } from "@/data/featured";
import { getDilliStats } from "@/lib/dilli-stats";
import { env } from "@/lib/env";
import { buildCloudinaryDeliveryUrl, buildScreenshotPublicId } from "@/lib/screenshot-store";

export default async function HomePage() {
  // Same Cloudinary screenshots /projects uses. Without the cloud name, rows fall back to a purple tile.
  const cloudName = env.CLOUDINARY_CLOUD_NAME;

  // Live from Vercel Web Analytics when configured (refreshed daily); otherwise the April 2026 figure.
  const stats = await getDilliStats();
  const statsAsOf = stats.live
    ? new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "Africa/Accra" }).format(new Date())
    : "April 2026";

  return (
    <>
      {/* Hero: the headline is edited live; the visitor's pointer gets its own flag. */}
      <PresenceStage className="pb-12 pt-12 sm:pb-16 sm:pt-20">
        <LiveHeadline />

        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[minmax(0,36rem)_1fr] lg:items-end">
          <p className="text-lg leading-relaxed text-ink/80 sm:text-xl">
            I&apos;m Philip Allotey, a full-stack developer in Accra. I build web apps in TypeScript, and I like the kind
            where lots of people are in the same place at once: shared notes, live dashboards, a restaurant&apos;s site
            on its busiest week.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/projects" className="btn btn-solid">
              See the work
            </Link>
            <Link href="/contact" className="btn btn-line">
              Get in touch
            </Link>
          </div>
        </div>
      </PresenceStage>

      {/* Status, written as sentences rather than labelled fields. */}
      <ul className="grid gap-x-10 gap-y-3 border-y border-line py-5 text-[15px] text-ink/80 sm:grid-cols-3">
        <li>
          It&apos;s <AccraClock className="font-semibold text-ink" /> in Accra.
        </li>
        <li>Junior analyst at Points Africa by day.</li>
        <li className="flex items-center gap-2.5">
          <span className="live-dot" aria-hidden />
          Open to freelance and contract projects.
        </li>
      </ul>

      {/* Dilli Dilli: two real data points, drawn to scale. */}
      <section className="mt-24 sm:mt-36" aria-labelledby="growth-heading">
        <Reveal as="h2" kind="sel" className="display max-w-4xl text-4xl text-heading sm:text-6xl">
          <span id="growth-heading" className="mark">
            One restaurant site, twelve months, 52 times the visitors.
          </span>
        </Reveal>

        <div className="mt-12 sm:mt-16">
          <GrowthBar total={stats.total} last30Days={stats.last30Days} asOf={statsAsOf} />
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 lg:grid-cols-[minmax(0,36rem)_1fr] lg:items-end">
          <p className="text-lg leading-relaxed text-ink/80">
            I built and launched dilli-dilli.com for Dilli Dilli, a restaurant in New York, and I still maintain it. It
            has been featured by the New York Times and Forbes.
          </p>
          <p className="lg:text-right">
            <a href="https://dilli-dilli.com/" target="_blank" rel="noopener noreferrer" className="link font-semibold">
              Open dilli-dilli.com
              <span className="sr-only"> (new tab)</span>
            </a>
          </p>
        </div>
      </section>

      {/* Selected work */}
      <section className="mt-24 sm:mt-36" aria-labelledby="work-heading">
        <div className="flex items-end justify-between gap-6 pb-8">
          <Reveal as="h2" kind="sel" className="display text-4xl text-heading sm:text-6xl">
            <span id="work-heading" className="mark">
              Selected work
            </span>
          </Reveal>
          <Link href="/projects" className="link shrink-0 pb-1 text-[15px] font-semibold">
            All projects
          </Link>
        </div>

        <ul className="border-t border-line">
          {FEATURED_WORK.map((work, i) => (
            <Reveal as="li" key={work.name} delay={i} className="border-b border-line">
              <a
                href={work.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-x-12 gap-y-6 py-8 sm:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center"
              >
                <div className="relative overflow-hidden rounded-lg border border-line bg-surface">
                  {cloudName ? (
                    <Image
                      src={buildCloudinaryDeliveryUrl(cloudName, buildScreenshotPublicId(work.repo))}
                      alt={`Screenshot of the ${work.name} site`}
                      width={1200}
                      height={600}
                      sizes="(max-width: 1024px) 100vw, 620px"
                      priority={i === 0}
                      className="aspect-2/1 w-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.035]"
                    />
                  ) : (
                    <div className="display flex aspect-2/1 items-center justify-center bg-brand p-6 text-center text-3xl text-white">
                      {work.name}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="display text-4xl text-heading sm:text-5xl">
                      <span className="row-mark">{work.name}</span>
                    </h3>
                    <ArrowUpRight
                      className="mt-1 size-8 shrink-0 text-ink transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      strokeWidth={iconStroke}
                      aria-hidden
                    />
                  </div>
                  <p className="mt-4 font-semibold text-ink">{work.kind}</p>
                  <p className="mt-1.5 max-w-xl leading-relaxed text-ink/75">{work.summary}</p>
                  <p className="mt-2 text-sm text-muted">{work.stack.join(", ")}</p>
                  <span className="sr-only">Opens in a new tab</span>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Closing */}
      <section className="brand-scope mt-24 rounded-xl p-6 sm:mt-36 sm:p-14" aria-labelledby="closing-heading">
        <Reveal as="h2" kind="sel" className="display max-w-4xl text-5xl text-heading sm:text-7xl">
          <span id="closing-heading" className="mark">
            Building something that has to hold up?
          </span>
        </Reveal>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/90">
          I take on freelance and contract projects alongside my day job. Tell me what you&apos;re making and where
          it&apos;s stuck.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="btn btn-solid">
            Get in touch
          </Link>
          <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-line">
            Résumé (PDF)
            <ArrowUpRight className="size-4" strokeWidth={iconStroke} aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
