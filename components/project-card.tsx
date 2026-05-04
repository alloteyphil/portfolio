"use client";

import Link from "next/link";
import Image from "next/image";
import type { PortfolioProject } from "@/types/project";
import posthog from "posthog-js";

type ProjectCardProps = {
  project: PortfolioProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="terminal-panel h-full">
      <header className="mb-4 flex items-center justify-between border-b border-terminal-border pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-terminal-amber">{project.name}</span>
      </header>

      <div className="mb-4 overflow-hidden rounded border border-terminal-border">
        <div className="border-b border-terminal-border bg-black/40 px-3 py-2 text-xs text-terminal-amber">
          {project.homepageUrl}
        </div>
        {project.screenshotUrl ? (
          <Image
            src={project.screenshotUrl}
            alt={`${project.name} screenshot`}
            width={1200}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 600px"
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 items-center justify-center text-xs text-terminal-text/70">
            Screenshot pending refresh...
          </div>
        )}
      </div>

      <h3 className="text-lg text-terminal-accent">{project.fullName}</h3>
      <p className="mt-2 text-sm text-terminal-text/90">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.topics.map((topic) => (
          <span key={topic} className="rounded border border-terminal-border px-2 py-0.5 text-xs text-terminal-amber">
            {topic}
          </span>
        ))}
      </div>

      <footer className="mt-5 flex gap-3 text-sm">
        <Link
          href={project.repositoryUrl}
          className="underline decoration-terminal-accent underline-offset-2"
          onClick={() => posthog.capture("project_source_link_clicked", { project_name: project.name })}
        >
          source
        </Link>
        <Link
          href={project.homepageUrl}
          className="underline decoration-terminal-amber underline-offset-2"
          onClick={() => posthog.capture("project_live_link_clicked", { project_name: project.name, url: project.homepageUrl })}
        >
          live
        </Link>
      </footer>
    </article>
  );
}
