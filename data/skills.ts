export type SkillGroup = {
  title: string;
  items: string[];
  /** Optional one-line context: where this group of skills is used. */
  note?: string;
};

/**
 * The About page maps over groups. Keep every item backed by real work:
 * the observability and infrastructure groups come from Points Africa (pa-signoz-infra),
 * the rest from the projects on this site.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL"]
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
    title: "Observability",
    items: [
      "SigNoz",
      "OpenTelemetry (traces, logs, metrics)",
      "Dashboards and alert rules as code",
      "Live health and incident pages",
      "Amazon CloudWatch"
    ]
  },
  {
    title: "Cloud and infrastructure",
    items: ["AWS (SSM, ALB, ECS, Lambda)", "Terraform", "Docker Compose", "nginx", "GitHub Actions"]
  },
  {
    title: "Data and integrations",
    items: ["PostgreSQL", "MongoDB", "AWS S3", "Cloudflare R2", "Stripe", "Paystack", "Vercel Analytics"]
  },
  {
    title: "Testing and tooling",
    items: ["Git", "pytest", "Vitest", "Jest", "ESLint", "Prettier", "Linear"]
  }
];
