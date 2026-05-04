import { TerminalFrame } from "@/components/terminal-frame";

const SKILLS = [
  "TypeScript",
  "Next.js",
  "React Native (Expo)",
  "Convex",
  "Tailwind CSS",
  "LiveKit",
  "PostHog",
  "Zod"
];

export default function AboutPage() {
  return (
    <TerminalFrame title="~/about">
      <p className="text-terminal-accent">$ cat profile.txt</p>
      <p className="mt-4 max-w-3xl text-terminal-text/90">
        I am a full-stack developer based in Accra, Ghana, focused on building with TypeScript across web and mobile.
        I currently work as a Founding Engineer at Clubz, building real-time social experiences with React Native,
        Convex, and LiveKit.
      </p>
      <p className="mt-3 max-w-3xl text-terminal-text/90">
        I have shipped client products with Next.js and Tailwind, including dilli-dilli.com, and maintained rapid
        release cycles tied to campaign launches. My work emphasizes product velocity, reliable architecture, and
        measurable outcomes.
      </p>
      <p className="mt-3 max-w-3xl text-terminal-text/90">
        Selected projects include PulseNotes and Trackr, where I built real-time collaboration, role-aware workflows,
        and performant paginated data flows.
      </p>

      <h2 className="mt-8 text-lg text-terminal-amber">skills</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {SKILLS.map((skill) => (
          <span key={skill} className="rounded border border-terminal-border px-2 py-1 text-sm">
            {skill}
          </span>
        ))}
      </div>
    </TerminalFrame>
  );
}
