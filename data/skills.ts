export type SkillGroup = {
  title: string;
  items: string[];
};

/** Mirrors the Technologies section of public/resume.pdf. The About page maps over groups. */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript"]
  },
  {
    title: "Web and mobile",
    items: ["React", "Next.js", "React Native (Expo)", "Expo Router", "Tailwind CSS", "React Query", "Zustand", "Zod"]
  },
  {
    title: "Backend and real-time",
    items: ["Node.js", "Convex", "REST APIs", "LiveKit", "Better Auth"]
  },
  {
    title: "Data and integrations",
    items: ["PostgreSQL", "MongoDB", "AWS S3", "Cloudflare R2", "Stripe", "Paystack", "Vercel Analytics"]
  },
  {
    title: "Tooling",
    items: ["Git", "Docker", "CI/CD", "ESLint", "Prettier", "Vitest", "Jest", "Linear"]
  }
];
