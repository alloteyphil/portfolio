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
};

export async function fetchUserRepos(): Promise<GitHubRepo[]> {
  if (!env.GITHUB_TOKEN || !env.GITHUB_USERNAME) {
    return [];
  }

  try {
    const { data: repos } = await octokit.request("GET /users/{username}/repos", {
      username: env.GITHUB_USERNAME,
      per_page: 100,
      sort: "pushed",
      direction: "desc",
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
      pushed_at: repo.pushed_at ?? new Date(0).toISOString()
    }));
  } catch (error) {
    console.error("Unable to fetch GitHub repositories for username:", env.GITHUB_USERNAME, error);
    return [];
  }
}
