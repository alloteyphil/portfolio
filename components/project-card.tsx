"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FolderGit2, Globe, Lock, iconButtonClass, iconStroke } from "@/components/icons";
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

  const showPrivateSource = project.sourceVisibility === "private" || !project.repositoryUrl;

  return (
    <article className="h-full min-w-0 rounded-xl border border-terminal-border bg-gradient-to-b from-terminal-panel to-terminal-bg p-4 shadow-terminal sm:p-5">
      <header className="mb-4 flex min-w-0 items-center justify-between gap-2 border-b border-terminal-border/70 pb-3">
        <div className="flex shrink-0 items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <span className="min-w-0 truncate text-right text-xs text-terminal-amber">{project.name}</span>
      </header>

      <div className="mb-4 min-w-0 overflow-hidden rounded-lg border border-terminal-border/70 bg-terminal-panel/50">
        <div className="border-b border-terminal-border/70 bg-terminal-bg/70 px-2 py-2 text-xs text-terminal-amber sm:px-3">
          <span className="block truncate" title={project.homepageUrl}>
            {project.homepageUrl}
          </span>
        </div>
        {hasScreenshot ? (
          <Image
            src={screenshotUrl!}
            alt={`${project.name} screenshot`}
            width={1200}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 600px"
            className="h-40 w-full object-cover sm:h-48"
            onError={() => setImageLoadFailed(true)}
          />
        ) : (
          <div className="flex h-40 items-center justify-center px-2 text-center text-xs text-terminal-text/70 sm:h-48">
            Screenshot not available yet. Run refresh to generate it.
          </div>
        )}
      </div>

      <h3 className="break-words text-base text-terminal-accent sm:text-lg">{project.fullName}</h3>
      <p className="mt-2 text-sm leading-relaxed text-terminal-text/90">{project.description}</p>

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

      <footer className="mt-5 flex flex-col gap-2 text-sm sm:flex-row sm:gap-3">
        {showPrivateSource ? (
          <span
            aria-disabled="true"
            title="Source is not publicly available"
            className="inline-flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded border border-terminal-border/60 px-3 py-2 text-terminal-text/55 sm:min-h-0 sm:py-1"
          >
            <Lock className={iconButtonClass} strokeWidth={iconStroke} aria-hidden />
            private
          </span>
        ) : (
          <Link
            href={project.repositoryUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded border border-terminal-border px-3 py-2 text-terminal-accent hover:border-terminal-accent sm:min-h-0 sm:py-1"
          >
            <FolderGit2 className={iconButtonClass} strokeWidth={iconStroke} aria-hidden />
            source
          </Link>
        )}
        <Link
          href={project.homepageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded border border-terminal-border px-3 py-2 text-terminal-amber hover:border-terminal-amber sm:min-h-0 sm:py-1"
        >
          <Globe className={iconButtonClass} strokeWidth={iconStroke} aria-hidden />
          live
        </Link>
      </footer>
    </article>
  );
}
