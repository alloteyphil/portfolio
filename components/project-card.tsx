"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PortfolioProject } from "@/types/project";

type ProjectCardProps = {
  project: PortfolioProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const screenshotUrl = project.screenshotUrl ?? undefined;
  const hasScreenshot = Boolean(screenshotUrl) && !imageLoadFailed;
  const stackTags = Array.from(
    new Set([
      ...(project.language ? [project.language] : []),
      ...project.topics.filter((topic) => topic.toLowerCase() !== "portfolio")
    ])
  ).slice(0, 6);

  return (
    <article className="h-full rounded-xl border border-terminal-border bg-gradient-to-b from-black/80 to-black/50 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_14px_40px_rgba(0,0,0,0.45)]">
      <header className="mb-4 flex items-center justify-between border-b border-terminal-border/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-terminal-amber">{project.name}</span>
      </header>

      <div className="mb-4 overflow-hidden rounded-lg border border-terminal-border/70 bg-black/30">
        <div className="border-b border-terminal-border/70 bg-black/50 px-3 py-2 text-xs text-terminal-amber">
          {project.homepageUrl}
        </div>
        {hasScreenshot ? (
          <Image
            src={screenshotUrl!}
            alt={`${project.name} screenshot`}
            width={1200}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 600px"
            className="h-48 w-full object-cover"
            onError={() => setImageLoadFailed(true)}
          />
        ) : (
          <div className="flex h-48 items-center justify-center text-xs text-terminal-text/70">
            Screenshot not available yet. Run refresh to generate it.
          </div>
        )}
      </div>

      <h3 className="text-lg text-terminal-accent">{project.fullName}</h3>
      <p className="mt-2 text-sm text-terminal-text/90">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {stackTags.map((topic) => (
          <span
            key={topic}
            className="rounded-full border border-terminal-border/70 bg-terminal-accent/10 px-2.5 py-0.5 text-xs text-terminal-accent"
          >
            {topic}
          </span>
        ))}
      </div>

      <footer className="mt-5 flex gap-3 text-sm">
        <Link
          href={project.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-terminal-border px-3 py-1 text-terminal-accent hover:border-terminal-accent"
        >
          source
        </Link>
        <Link
          href={project.homepageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-terminal-border px-3 py-1 text-terminal-amber hover:border-terminal-amber"
        >
          live
        </Link>
      </footer>
    </article>
  );
}
