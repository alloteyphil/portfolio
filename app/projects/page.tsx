import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { TerminalFrame } from "@/components/terminal-frame";
import { env } from "@/lib/env";
import { getPortfolioProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects",
  description: "A curated list of shipped projects — public repos, private work, and client sites.",
  openGraph: {
    title: "Projects",
    description: "A curated list of shipped projects — public repos, private work, and client sites.",
    url: "/projects"
  }
};

export default async function ProjectsPage() {
  const projects = await getPortfolioProjects();
  const githubConfigured = Boolean(env.GITHUB_TOKEN && env.GITHUB_USERNAME);

  return (
    <TerminalFrame title="~/projects">
      <p className="mb-6 text-sm leading-relaxed text-terminal-text/85">
        Curated portfolio: GitHub projects tagged <span className="text-terminal-amber">portfolio</span> plus
        manually added private and client work.
      </p>

      {projects.length === 0 ? (
        <div className="rounded border border-dashed border-terminal-border p-6 text-sm text-terminal-text/70">
          {githubConfigured ? (
            <>
              No projects to show yet. Tag a GitHub repo with{" "}
              <span className="text-terminal-amber">portfolio</span> or add a manual entry from{" "}
              <span className="text-terminal-amber">/admin</span>.
            </>
          ) : (
            <>
              GitHub is not configured. Set <span className="text-terminal-amber">GITHUB_TOKEN</span> and{" "}
              <span className="text-terminal-amber">GITHUB_USERNAME</span> in your environment, or add manual
              projects from <span className="text-terminal-amber">/admin</span>.
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </TerminalFrame>
  );
}
