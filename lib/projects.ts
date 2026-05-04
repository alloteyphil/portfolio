import { fetchUserRepos } from "./github";
import { buildScreenshotPublicId } from "./screenshot-store";
import { getCloudinaryScreenshotUrl } from "./cloudinary";
import type { PortfolioProject } from "@/types/project";

function cleanUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const normalized = new URL(value);
    return normalized.toString();
  } catch {
    return null;
  }
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const repos = await fetchUserRepos();

  const candidates = repos
    .filter((repo) => repo.topics.includes("portfolio"))
    .map((repo) => ({
      repo,
      homepageUrl: cleanUrl(repo.homepage)
    }))
    .filter((repo) => Boolean(repo.homepageUrl));

  const projects = await Promise.all(
    candidates.map(async ({ repo, homepageUrl }) => {
      const screenshotPublicId = buildScreenshotPublicId(repo.name);
      const screenshotUrl = await getCloudinaryScreenshotUrl(screenshotPublicId);

      return {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description ?? "No description provided.",
        homepageUrl: homepageUrl!,
        repositoryUrl: repo.html_url,
        defaultBranch: repo.default_branch,
        language: repo.language,
        topics: repo.topics,
        pushedAt: repo.pushed_at,
        screenshotPublicId,
        screenshotUrl
      };
    })
  );

  return projects.sort((a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime());
}
