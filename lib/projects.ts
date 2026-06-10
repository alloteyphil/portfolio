import { fetchUserRepos, type GitHubRepo } from "./github";
import { buildScreenshotPublicId } from "./screenshot-store";
import { getCloudinaryScreenshotUrl } from "./cloudinary";
import { getPortfolioConfigWithSha, saveCachedGithubRepos } from "./portfolio-config";
import {
  buildGithubProjectId,
  buildManualProjectId,
  type CachedGithubRepo,
  type ManualProjectRecord,
  type PortfolioProject
} from "@/types/project";

function cleanUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const normalized = new URL(value);
    return normalized.toString();
  } catch {
    return null;
  }
}

async function buildProjectFromManual(record: ManualProjectRecord): Promise<PortfolioProject> {
  const screenshotPublicId = buildScreenshotPublicId(`manual-${record.slug}`);
  const screenshotUrl = await getCloudinaryScreenshotUrl(screenshotPublicId);

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
    screenshotUrl
  };
}

function applyConfiguredOrder(projects: PortfolioProject[], order: readonly string[]): PortfolioProject[] {
  if (order.length === 0) {
    return [...projects].sort(
      (a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
    );
  }

  const indexById = new Map<string, number>();
  order.forEach((id, index) => {
    if (!indexById.has(id)) {
      indexById.set(id, index);
    }
  });

  const ordered = [...projects];
  ordered.sort((a, b) => {
    const aIndex = indexById.get(a.id);
    const bIndex = indexById.get(b.id);

    if (aIndex !== undefined && bIndex !== undefined) {
      return aIndex - bIndex;
    }
    if (aIndex !== undefined) return -1;
    if (bIndex !== undefined) return 1;

    return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
  });

  return ordered;
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
  const ONE_HOUR_MS = 60 * 60 * 1000;
  return Date.now() - new Date(cachedAt).getTime() > ONE_HOUR_MS;
}

async function buildGithubProjectsFromRepos(repos: GitHubRepo[]): Promise<PortfolioProject[]> {
  const candidates = repos
    .map((repo) => ({
      repo,
      homepageUrl: cleanUrl(repo.homepage)
    }))
    .filter(({ repo, homepageUrl }) => Boolean(homepageUrl) && repo.topics.includes("portfolio"))
    .slice(0, 30);

  return Promise.all(
    candidates.map(async ({ repo, homepageUrl }) => {
      const screenshotPublicId = buildScreenshotPublicId(repo.name);
      const screenshotUrl = await getCloudinaryScreenshotUrl(screenshotPublicId);

      const project: PortfolioProject = {
        id: buildGithubProjectId(repo.name),
        kind: "github",
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description ?? "No description provided.",
        homepageUrl: homepageUrl!,
        repositoryUrl: repo.html_url,
        sourceVisibility: repo.is_private ? "private" : "public",
        defaultBranch: repo.default_branch,
        language: repo.language,
        topics: repo.topics,
        pushedAt: repo.pushed_at,
        screenshotPublicId,
        screenshotUrl
      };

      return project;
    })
  );
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const [liveRepos, config] = await Promise.all([
    fetchUserRepos(),
    getPortfolioConfigWithSha()
  ]);

  let githubProjects: PortfolioProject[];

  if (liveRepos !== null) {
    // Live fetch succeeded — build from fresh GitHub data.
    githubProjects = await buildGithubProjectsFromRepos(liveRepos);

    // Persist a snapshot so the next run can fall back if the token expires.
    // Fire-and-forget: a write failure must not block the page render.
    // Only refresh the snapshot when it is stale (older than 1 hour) to stay
    // well within GitHub API rate limits.
    if (isCacheStale(config.cachedAt)) {
      const snapshot = liveRepos.map(toGithubCacheEntry);
      saveCachedGithubRepos(snapshot, config).catch((err: unknown) => {
        console.error("Failed to persist GitHub repo snapshot:", err);
      });
    }
  } else {
    // Live fetch unavailable (token missing/expired or API error).
    // Serve from the last known-good snapshot so /projects stays populated.
    if (config.cachedGithubRepos.length > 0) {
      console.warn(
        `GitHub token unavailable — rendering /projects from cached snapshot (cachedAt: ${config.cachedAt ?? "unknown"}).`
      );
    }
    const cachedRepos = config.cachedGithubRepos.map(fromGithubCacheEntry);
    githubProjects = await buildGithubProjectsFromRepos(cachedRepos);
  }

  const manualProjects = await Promise.all(config.manualProjects.map(buildProjectFromManual));

  return applyConfiguredOrder([...githubProjects, ...manualProjects], config.order);
}
