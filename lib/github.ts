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

export type EditableProjectRepo = {
  id: number;
  name: string;
  fullName: string;
  description: string;
  repositoryUrl: string;
  homepageUrl: string | null;
  language: string | null;
  topics: string[];
  isVisible: boolean;
  isPrivate: boolean;
};

export async function fetchUserRepos(): Promise<GitHubRepo[]> {
  if (!env.GITHUB_TOKEN || !env.GITHUB_USERNAME) {
    return [];
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
    return [];
  }
}

function cleanUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

export async function fetchEditableProjectRepos(): Promise<EditableProjectRepo[]> {
  const repos = await fetchUserRepos();
  return repos
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description ?? "",
      repositoryUrl: repo.html_url,
      homepageUrl: cleanUrl(repo.homepage),
      language: repo.language,
      topics: repo.topics,
      isVisible: repo.topics.includes("portfolio"),
      isPrivate: repo.is_private
    }))
    .sort((a, b) => Number(b.isVisible) - Number(a.isVisible) || a.name.localeCompare(b.name));
}

export type RepoSettingsUpdateInput = {
  fullName: string;
  visible: boolean;
  description: string;
  homepageUrl: string | null;
  topics: string[];
};

export async function updateRepoProjectSettings(input: RepoSettingsUpdateInput): Promise<void> {
  if (!env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is missing.");
  }

  const [owner, repo] = input.fullName.split("/");
  if (!owner || !repo) {
    throw new Error(`Invalid repo full name: ${input.fullName}`);
  }

  const normalizedTopics = new Set(
    input.topics
      .map((topic) => topic.trim().toLowerCase())
      .filter(Boolean)
  );

  if (input.visible) {
    normalizedTopics.add("portfolio");
  } else {
    normalizedTopics.delete("portfolio");
  }

  await octokit.request("PATCH /repos/{owner}/{repo}", {
    owner,
    repo,
    description: input.description.trim(),
    homepage: input.homepageUrl ?? undefined,
    headers: { accept: "application/vnd.github+json" }
  });

  await octokit.request("PUT /repos/{owner}/{repo}/topics", {
    owner,
    repo,
    names: Array.from(normalizedTopics),
    headers: { accept: "application/vnd.github+json" }
  });
}

export async function setRepoVisibilityByTopic(fullName: string, visible: boolean): Promise<void> {
  if (!env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is missing.");
  }

  const [owner, repo] = fullName.split("/");
  if (!owner || !repo) {
    throw new Error(`Invalid repo full name: ${fullName}`);
  }

  const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
    owner,
    repo,
    headers: { accept: "application/vnd.github+json" }
  });

  const nextTopics = new Set(data.topics ?? []);
  if (visible) {
    nextTopics.add("portfolio");
  } else {
    nextTopics.delete("portfolio");
  }

  await octokit.request("PUT /repos/{owner}/{repo}/topics", {
    owner,
    repo,
    names: Array.from(nextTopics),
    headers: { accept: "application/vnd.github+json" }
  });
}
