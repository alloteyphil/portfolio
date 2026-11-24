export type SkillGroup = {
  title: string;
  items: string[];
  /** Optional one-line context: where this group of skills is used. */
  note?: string;
};

/**
 * The About page maps over these groups. Kept in step with the Technical Skills
 * section of `Philip_Allotey_CV.pdf` (updated 2026-11-24).
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "HTML", "CSS"]
  },
  {
    title: "Frontend and mobile",
    items: [
      "React",
      "Next.js (App Router, Server Actions)",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
      "Zustand",
      "Redux",
      "React Hook Form",
      "Zod",
      "Motion",
      "React Native (Expo)",
      "Reanimated"
    ]
  },
  {
    title: "Backend and CMS",
    items: ["Node.js", "Express", "FastAPI", "Flask", "REST APIs", "Convex", "Payload CMS", "WordPress"]
  },
  {
    title: "Auth, payments and messaging",
    items: ["Clerk", "Better Auth", "Stripe", "Paystack", "Resend", "LiveKit"]
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "MongoDB (Mongoose)", "SQLAlchemy", "Alembic"]
  },
  {
    title: "Cloud and DevOps",
    items: [
      "AWS (Lambda, API Gateway, ECS, S3, CloudWatch)",
      "Vercel",
      "Docker",
      "Terraform",
      "GitHub Actions"
    ]
  },
  {
    title: "Observability and analytics",
    items: ["OpenTelemetry", "SigNoz", "Vercel Analytics", "PostHog"]
  },
  {
    title: "Testing",
    items: ["Vitest", "Jest", "React Testing Library", "Playwright", "Python unittest"]
  },
  {
    title: "AI and tools",
    items: ["Claude API", "Cursor", "Claude Code", "Git", "GitHub", "Linear"]
  }
];
