import { cache } from "react";
import { after } from "next/server";
import { env } from "./env";
import { fetchUserRepos, type GitHubRepo } from "./github";
import { getPortfolioConfig, saveCachedGithubRepos } from "./portfolio-config";
import { buildScreenshotPublicId, resolveScreenshotUrl } from "./screenshot-store";
import {
  buildGithubProjectId,
  buildManualProjectId,
  type CachedGithubRepo,
  type ManualProjectRecord,
  type PortfolioProject
} from "@/types/project";

const ONE_HOUR_MS = 60 * 60 * 1000;

function cleanUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

function buildProjectFromManual(record: ManualProjectRecord): PortfolioProject {
  const screenshotPublicId = buildScreenshotPublicId(`manual-${record.slug}`);

  return {
    id: buildManualProjectId(record.slug),
    kind: "manual",
    name: record.name,
    fullName: record.fullName || record.name,
    description: record.description?.trim() || "No description provided.",
    homepageUrl: record.homepageUrl,
    repositoryUrl: record.repositoryUrl,
    sourceVisibility: record.sourceVisibility,
    defaultBranch: null,
    language: record.language,
    topics: record.topics ?? [],
    pushedAt: record.createdAt,
    screenshotPublicId,
    screenshotUrl: resolveScreenshotUrl(env.CLOUDINARY_CLOUD_NAME, screenshotPublicId)
  };
}

function applyConfiguredOrder(projects: PortfolioProject[], order: readonly string[]): PortfolioProject[] {
  if (order.length === 0) {
    return projects.toSorted(
      (a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt)
    );
  }

  const indexById = new Map<string, number>();
  for (let i = 0; i < order.length; i++) {
    const id = order[i]!;
    if (!indexById.has(id)) indexById.set(id, i);
  }

  return projects.toSorted((a, b) => {
    const aIndex = indexById.get(a.id);
    const bIndex = indexById.get(b.id);

    if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
    if (aIndex !== undefined) return -1;
    if (bIndex !== undefined) return 1;

    return Date.parse(b.pushedAt) - Date.parse(a.pushedAt);
  });
}

function toGithubCacheEntry(repo: GitHubRepo): CachedGithubRepo {
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    homepage: repo.homepage,
    htmlUrl: repo.html_url,
    defaultBranch: repo.default_branch,
    language: repo.language,
    topics: repo.topics,
    pushedAt: repo.pushed_at,
    isPrivate: repo.is_private
  };
}

function fromGithubCacheEntry(cached: CachedGithubRepo): GitHubRepo {
  return {
    id: 0,
    name: cached.name,
    full_name: cached.fullName,
    description: cached.description,
    homepage: cached.homepage,
    html_url: cached.htmlUrl,
    default_branch: cached.defaultBranch,
    language: cached.language,
    topics: cached.topics,
    pushed_at: cached.pushedAt,
    is_private: cached.isPrivate
  };
}

function isCacheStale(cachedAt: string | null): boolean {
  if (!cachedAt) return true;
  return Date.now() - Date.parse(cachedAt) > ONE_HOUR_MS;
}

function buildGithubProjectsFromRepos(repos: GitHubRepo[]): PortfolioProject[] {
  const projects: PortfolioProject[] = [];

  for (const repo of repos) {
    if (!repo.topics.includes("portfolio")) continue;
    const homepageUrl = cleanUrl(repo.homepage);
    if (!homepageUrl) continue;

    const screenshotPublicId = buildScreenshotPublicId(repo.name);
    projects.push({
      id: buildGithubProjectId(repo.name),
      kind: "github",
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description ?? "No description provided.",
      homepageUrl,
      repositoryUrl: repo.html_url,
      sourceVisibility: repo.is_private ? "private" : "public",
      defaultBranch: repo.default_branch,
      language: repo.language,
      topics: repo.topics,
      pushedAt: repo.pushed_at,
      screenshotPublicId,
      screenshotUrl: resolveScreenshotUrl(env.CLOUDINARY_CLOUD_NAME, screenshotPublicId)
    });

    if (projects.length >= 30) break;
  }

  return projects;
}

export const getPortfolioProjects = cache(async (): Promise<PortfolioProject[]> => {
  const [liveRepos, config] = await Promise.all([
    fetchUserRepos(),
    getPortfolioConfig()
  ]);

  let githubProjects: PortfolioProject[];

  if (liveRepos !== null) {
    githubProjects = buildGithubProjectsFromRepos(liveRepos);

    if (isCacheStale(config.cachedAt)) {
      const snapshot = liveRepos.map(toGithubCacheEntry);
      try {
        after(async () => {
          try {
            await saveCachedGithubRepos(snapshot);
          } catch (err) {
            console.error("Failed to persist GitHub repo snapshot:", err);
          }
        });
      } catch {
        // `after()` throws outside a request scope (e.g. static build prerender); skip snapshot write there.
      }
    }
  } else {
    if (config.cachedGithubRepos.length > 0) {
      console.warn(
        `GitHub token unavailable — rendering /projects from cached snapshot (cachedAt: ${config.cachedAt ?? "unknown"}).`
      );
    }
    githubProjects = buildGithubProjectsFromRepos(config.cachedGithubRepos.map(fromGithubCacheEntry));
  }

  const manualProjects = config.manualProjects.map(buildProjectFromManual);

  return applyConfiguredOrder([...githubProjects, ...manualProjects], config.order);
});
