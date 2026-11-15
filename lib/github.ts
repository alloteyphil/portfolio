import { Octokit } from "octokit";
import { env } from "./env";

const octokit = new Octokit({
  auth: env.GITHUB_TOKEN
});

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
 * Returns an array (possibly empty) on success.
 */
export async function fetchUserRepos(): Promise<GitHubRepo[] | null> {
  if (!env.GITHUB_TOKEN || !env.GITHUB_USERNAME) {
    return null;
  }

  try {
    // Use the authenticated user endpoint so private repos owned by the token
    // user are visible to the curation pipeline. Fallback to the public listing
    // if the token does not have read access to the authenticated user endpoint.
    const { data: repos } = await octokit.request("GET /user/repos", {
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
      id: repo.id,
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
