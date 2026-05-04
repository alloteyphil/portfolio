export type SkillGroup = {
  title: string;
  items: string[];
};

/** Edit this list as your stack grows — the About page maps over groups. */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Languages & runtimes",
    items: ["TypeScript", "JavaScript", "Node.js", "Bun"]
  },
  {
    title: "Web & UI",
    items: ["Next.js", "React", "Tailwind CSS", "HTML / CSS", "App Router", "Server Components"]
  },
  {
    title: "Mobile",
    items: ["React Native", "Expo"]
  },
  {
    title: "Backend & APIs",
    items: ["REST", "Webhooks", "Server Actions", "Edge / Node runtimes"]
  },
  {
    title: "Data & persistence",
    items: ["Convex", "Zod", "Schema design"]
  },
  {
    title: "Real-time & infra",
    items: ["LiveKit", "WebSockets mindset", "Vercel", "GitHub Actions"]
  },
  {
    title: "Tooling & quality",
    items: ["Git", "ESLint", "CI/CD", "Octokit", "E2E-minded testing"]
  },
  {
    title: "Cloud & integrations",
    items: ["Cloudinary", "Resend", "Cloudflare Turnstile", "Screenshot pipelines"]
  }
];
