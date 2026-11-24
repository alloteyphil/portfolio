export type FeaturedWork = {
  name: string;
  /** What it is, in a few plain words. */
  kind: string;
  /** One or two sentences: what it does, and the result if there is one. */
  summary: string;
  stack: string[];
  href: string;
  /** GitHub repo name; the screenshot is the same Cloudinary image /projects uses (portfolio/<repo>). */
  repo: string;
};

/**
 * Hand-curated selection for the homepage. The full list on /projects comes from GitHub + data/portfolio-config.json.
 * Keep this to 3–4 entries, projects only (no employment history, by decision on 2026-11-14).
 */
export const FEATURED_WORK: FeaturedWork[] = [
  {
    name: "Dilli Dilli",
    kind: "Restaurant website, New York",
    summary:
      "Launched at 1,200 monthly visitors and grown past 94,600+ total, featured by the New York Times and Forbes.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    href: "https://dilli-dilli.com/",
    repo: "dilli-dilli"
  },
  {
    name: "Pulse Notes",
    kind: "Collaborative notes",
    summary:
      "Several people in one note at the same time: live presence, comment threads you can resolve, a shared whiteboard, and revision history you can restore from.",
    stack: ["Next.js", "Convex", "Clerk"],
    href: "https://pulse-notes.vercel.app/",
    repo: "pulse-notes"
  },
  {
    name: "Trackr",
    kind: "Personal finance tracker",
    summary:
      "Log transactions, sort them into categories and keep an eye on monthly budgets. The dashboard updates in real time.",
    stack: ["Next.js", "Convex", "Clerk"],
    href: "https://trackrfinance.vercel.app/",
    repo: "trackr"
  }
];
