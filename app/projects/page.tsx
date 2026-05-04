import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { TerminalFrame } from "@/components/terminal-frame";
import { env } from "@/lib/env";
import { getPortfolioProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A live list of repos I tag portfolio — pulled from GitHub with screenshots refreshed on demand.",
  openGraph: {
    title: "Projects",
    description:
      "A live list of repos I tag portfolio — pulled from GitHub with screenshots refreshed on demand.",
    url: "/projects"
  }
};

export default async function ProjectsPage() {
  const projects = await getPortfolioProjects();
  const githubConfigured = Boolean(env.GITHUB_TOKEN && env.GITHUB_USERNAME);

  return (
    <TerminalFrame title="~/projects">
      <p className="mb-6 text-sm leading-relaxed text-terminal-text/85">
        Showing repos tagged <span className="text-terminal-amber">portfolio</span> with a valid homepage URL.
      </p>

      {projects.length === 0 ? (
        <div className="rounded border border-dashed border-terminal-border p-6 text-sm text-terminal-text/70">
          {githubConfigured ? (
            <>
              No project repos found yet. Add a homepage URL to your GitHub repos and optionally tag them{" "}
              <span className="text-terminal-amber">portfolio</span> in admin to show them here.
            </>
          ) : (
            <>
              GitHub is not configured. Set <span className="text-terminal-amber">GITHUB_TOKEN</span> and{" "}
              <span className="text-terminal-amber">GITHUB_USERNAME</span> in your environment.
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
