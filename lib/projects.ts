import { fetchUserRepos } from "./github";
import { buildScreenshotPublicId } from "./screenshot-store";
import { getCloudinaryScreenshotUrl } from "./cloudinary";
import { getPortfolioConfig } from "./portfolio-config";
import {
  buildGithubProjectId,
  buildManualProjectId,
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

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const [repos, config] = await Promise.all([fetchUserRepos(), getPortfolioConfig()]);

  const githubCandidates = repos
    .map((repo) => ({
      repo,
      homepageUrl: cleanUrl(repo.homepage)
    }))
    .filter(({ repo, homepageUrl }) => Boolean(homepageUrl) && repo.topics.includes("portfolio"))
    .slice(0, 30);

  const githubProjects = await Promise.all(
    githubCandidates.map(async ({ repo, homepageUrl }) => {
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

  const manualProjects = await Promise.all(config.manualProjects.map(buildProjectFromManual));

  const merged = [...githubProjects, ...manualProjects];

  return applyConfiguredOrder(merged, config.order);
}
