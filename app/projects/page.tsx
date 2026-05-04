import { ProjectCard } from "@/components/project-card";
import { TerminalFrame } from "@/components/terminal-frame";
import { getPortfolioProjects } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getPortfolioProjects();

  return (
    <TerminalFrame title="~/projects">
      <p className="mb-6 text-sm text-terminal-text/85">
        Showing repositories tagged with <span className="text-terminal-amber">portfolio</span> on GitHub.
      </p>

      {projects.length === 0 ? (
        <div className="rounded border border-dashed border-terminal-border p-6 text-sm text-terminal-text/70">
          No project repos found. Add topic <span className="text-terminal-amber">portfolio</span> to any repo and set a homepage URL.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </TerminalFrame>
  );
}
