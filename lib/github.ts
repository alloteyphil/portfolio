import { Octokit } from "octokit";
import { env } from "./env";

let octokitInstance: Octokit | null = null;

/** Shared lazy Octokit singleton so GitHub API consumers don't re-instantiate plugins per call. */
export function getOctokit(): Octokit {
  if (!env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is missing.");
  }
  if (!octokitInstance) {
    octokitInstance = new Octokit({ auth: env.GITHUB_TOKEN });
  }
  return octokitInstance;
}

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  homepage: string | null;
  html_url: string;
  default_branch: string;
  language: string | null;
  topics: string[];
  pushed_at: string;
  is_private: boolean;
};

/**
 * Fetches all repos for the authenticated user.
 * Returns null when the token is missing/expired or the API call fails —
 * callers should fall back to any cached snapshot in that case.
 */
export async function fetchUserRepos(): Promise<GitHubRepo[] | null> {
  if (!env.GITHUB_TOKEN || !env.GITHUB_USERNAME) {
    return null;
  }

  try {
    const { data: repos } = await getOctokit().request("GET /user/repos", {
      per_page: 100,
      sort: "pushed",
      direction: "desc",
      visibility: "all",
      affiliation: "owner",
      headers: {
        accept: "application/vnd.github+json"
      }
    });

    return repos.map((repo) => ({
      id: Number(repo.id),
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      homepage: repo.homepage ?? null,
      html_url: repo.html_url,
      default_branch: repo.default_branch ?? "main",
      language: repo.language ?? null,
      topics: repo.topics ?? [],
      pushed_at: repo.pushed_at ?? new Date(0).toISOString(),
      is_private: Boolean(repo.private)
    }));
  } catch (error) {
    console.error("Unable to fetch GitHub repositories for username:", env.GITHUB_USERNAME, error);
    return null;
  }
}
