import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { env } from "@/lib/env";
import { getPortfolioProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DESCRIPTION = "Client sites, products and older builds by Philip Allotey. Every one is deployed, so you can open it.";

export const metadata: Metadata = {
  title: "Work",
  description: DESCRIPTION,
  openGraph: { title: "Work", description: DESCRIPTION, url: "/projects" }
};

export default async function ProjectsPage() {
  const projects = await getPortfolioProjects();
  const githubConfigured = Boolean(env.GITHUB_TOKEN && env.GITHUB_USERNAME);

  return (
    <>
      <PageHeader title="Everything here is live. Go ahead and open it.">
        {projects.length > 0 ? `${projects.length} projects: ` : ""}client sites, my own products and a few older
        builds I still like.
      </PageHeader>

      <Reveal kind="line" className="mb-12 h-px w-full bg-line sm:mb-14" />

      {projects.length === 0 ? (
        <Reveal kind="up" className="rounded-lg border border-dashed border-line p-8 text-ink/75">
          {githubConfigured ? (
            <>
              No projects to show yet. Tag a GitHub repo with <code className="font-mono text-ink">portfolio</code> or
              add a manual entry to <code className="font-mono text-ink">data/portfolio-config.json</code>.
            </>
          ) : (
            <>
              GitHub is not configured. Set <code className="font-mono text-ink">GITHUB_TOKEN</code> and{" "}
              <code className="font-mono text-ink">GITHUB_USERNAME</code> in your environment, or add manual projects
              to <code className="font-mono text-ink">data/portfolio-config.json</code>.
            </>
          )}
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.id} kind="up" delay={i < 4 ? i : i % 2}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
