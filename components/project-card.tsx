"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CardTilt } from "@/components/card-tilt";
import { ArrowUpRight, FolderGit2, Lock, iconStroke } from "@/components/icons";
import type { PortfolioProject } from "@/types/project";

type ProjectCardProps = {
  project: PortfolioProject;
};

function displayHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const screenshotUrl = project.screenshotUrl ?? undefined;
  const hasScreenshot = Boolean(screenshotUrl) && !imageLoadFailed;
  const stackTags = Array.from(
    new Set([
      ...(project.language ? [project.language] : []),
      ...project.topics.filter((topic) => !["portfolio", "git", "github"].includes(topic.toLowerCase()))
    ])
  ).slice(0, 5);

  const showPrivateSource = project.sourceVisibility === "private" || !project.repositoryUrl;
  const host = displayHost(project.homepageUrl);

  return (
    <article className="group flex h-full min-w-0 flex-col">
      <a
        href={project.homepageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-lg"
        aria-label={`Open ${project.name} live site (new tab)`}
      >
        <CardTilt className="relative overflow-hidden rounded-lg border border-line bg-surface">
          {hasScreenshot ? (
            <Image
              src={screenshotUrl!}
              alt=""
              width={1200}
              height={600}
              sizes="(max-width: 768px) 100vw, 580px"
              className="aspect-2/1 w-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.035]"
              onError={() => setImageLoadFailed(true)}
            />
          ) : (
            <div className="display flex aspect-2/1 items-center justify-center bg-brand p-6 text-center text-3xl text-white">
              {project.name}
            </div>
          )}
          <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-transform duration-300 ease-out group-hover:translate-y-0">
            {host}
            <ArrowUpRight className="arrow-launch size-4" strokeWidth={2} aria-hidden />
          </span>
        </CardTilt>
      </a>

      <div className="flex flex-1 flex-col pt-5">
        <h3 className="min-w-0 text-xl font-bold text-ink">
          <span className="row-mark">{project.name}</span>
        </h3>
        <p className="mt-2 line-clamp-3 leading-relaxed text-ink/75">{project.description}</p>

        {stackTags.length > 0 ? (
          <p className="mt-3 text-sm text-muted transition-colors duration-200 group-hover:text-ink/80">
            {stackTags.join(", ")}
          </p>
        ) : null}

        <footer className="mt-auto flex gap-5 pt-5 text-[15px]">
          <Link
            href={project.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link inline-flex items-center gap-1 font-semibold text-ink"
          >
            Open live site
            <ArrowUpRight className="size-3.5" strokeWidth={iconStroke} aria-hidden />
          </Link>
          {showPrivateSource ? (
            <span className="inline-flex items-center gap-1.5 text-muted" title="Source is not publicly available">
              <Lock className="size-3.5" strokeWidth={iconStroke} aria-hidden />
              Private source
            </span>
          ) : (
            <Link
              href={project.repositoryUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted transition hover:text-ink"
            >
              <FolderGit2 className="size-3.5" strokeWidth={iconStroke} aria-hidden />
              Source
            </Link>
          )}
        </footer>
      </div>
    </article>
  );
}
