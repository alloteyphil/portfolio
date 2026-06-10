import { Octokit } from "octokit";
import { z } from "zod";
import { env } from "./env";
import type { CachedGithubRepo, ManualProjectRecord, PortfolioConfig, ProjectSourceVisibility } from "@/types/project";

const CONFIG_PATH = "data/portfolio-config.json";

const sourceVisibilitySchema = z.union([z.literal("public"), z.literal("private")]);

const manualProjectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  fullName: z.string().min(1),
  description: z.string().default(""),
  homepageUrl: z.string().url(),
  repositoryUrl: z.union([z.string().url(), z.null()]).default(null),
  sourceVisibility: sourceVisibilitySchema.default("private"),
  language: z.union([z.string(), z.null()]).default(null),
  topics: z.array(z.string()).default([]),
  createdAt: z.string().default(() => new Date().toISOString())
});

const cachedGithubRepoSchema = z.object({
  name: z.string(),
  fullName: z.string(),
  description: z.union([z.string(), z.null()]).default(null),
  homepage: z.union([z.string(), z.null()]).default(null),
  htmlUrl: z.string(),
  defaultBranch: z.string().default("main"),
  language: z.union([z.string(), z.null()]).default(null),
  topics: z.array(z.string()).default([]),
  pushedAt: z.string(),
  isPrivate: z.boolean().default(false)
});

const portfolioConfigSchema = z.object({
  manualProjects: z.array(manualProjectSchema).default([]),
  order: z.array(z.string()).default([]),
  cachedGithubRepos: z.array(cachedGithubRepoSchema).default([]),
  cachedAt: z.union([z.string(), z.null()]).default(null)
});

const EMPTY_CONFIG: PortfolioConfig = {
  manualProjects: [],
  order: [],
  cachedGithubRepos: [],
  cachedAt: null
};

function getOctokit(): Octokit {
  if (!env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is missing.");
  }
  return new Octokit({ auth: env.GITHUB_TOKEN });
}

function getRepoTarget(): { owner: string; repo: string } {
  const repoSlug = env.PORTFOLIO_CONFIG_REPO ?? env.GITHUB_USERNAME;
  if (!repoSlug) {
    throw new Error("PORTFOLIO_CONFIG_REPO or GITHUB_USERNAME must be set.");
  }

  if (repoSlug.includes("/")) {
    const [owner, repo] = repoSlug.split("/");
    if (!owner || !repo) {
      throw new Error("PORTFOLIO_CONFIG_REPO must be 'owner/repo'.");
    }
    return { owner, repo };
  }

  const repo = env.PORTFOLIO_CONFIG_REPO_NAME ?? "portfolio";
  return { owner: repoSlug, repo };
}

type RemoteFile = { content: string; sha: string };

async function fetchRemoteConfigFile(): Promise<RemoteFile | null> {
  if (!env.GITHUB_TOKEN) return null;
  const octokit = getOctokit();
  const { owner, repo } = getRepoTarget();

  try {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path: CONFIG_PATH,
      headers: { accept: "application/vnd.github+json" }
    });

    if (Array.isArray(data) || data.type !== "file" || !("content" in data) || typeof data.content !== "string") {
      return null;
    }

    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    return { content: decoded, sha: data.sha };
  } catch (error) {
    if (isNotFoundError(error)) return null;
    console.error("Failed to fetch portfolio config from GitHub:", error);
    return null;
  }
}

function isNotFoundError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status?: number }).status === 404
  );
}

function parseConfigContent(content: string): PortfolioConfig {
  try {
    const json = JSON.parse(content) as unknown;
    const parsed = portfolioConfigSchema.safeParse(json);
    if (!parsed.success) {
      console.error("Invalid portfolio config payload:", parsed.error.issues);
      return EMPTY_CONFIG;
    }
    return parsed.data;
  } catch (error) {
    console.error("Unable to parse portfolio config JSON:", error);
    return EMPTY_CONFIG;
  }
}

async function readLocalConfigFile(): Promise<PortfolioConfig> {
  try {
    // Loaded lazily so that build-time output tracing picks up the JSON file.
    const localConfig = (await import("@/data/portfolio-config.json")) as { default?: unknown } & Record<string, unknown>;
    const value = (localConfig.default ?? localConfig) as unknown;
    const parsed = portfolioConfigSchema.safeParse(value);
    if (!parsed.success) return EMPTY_CONFIG;
    return parsed.data;
  } catch {
    return EMPTY_CONFIG;
  }
}

export async function getPortfolioConfig(): Promise<PortfolioConfig> {
  const remote = await fetchRemoteConfigFile();
  if (remote) {
    return parseConfigContent(remote.content);
  }
  return readLocalConfigFile();
}

export type SavedPortfolioConfig = PortfolioConfig & { sha: string | null };

export async function getPortfolioConfigWithSha(): Promise<SavedPortfolioConfig> {
  const remote = await fetchRemoteConfigFile();
  if (remote) {
    return { ...parseConfigContent(remote.content), sha: remote.sha };
  }

  const fallback = await readLocalConfigFile();
  return { ...fallback, sha: null };
}

export async function savePortfolioConfig(
  config: PortfolioConfig,
  options: { message?: string; sha?: string } = {}
): Promise<void> {
  const octokit = getOctokit();
  const { owner, repo } = getRepoTarget();
  // Use the provided sha when available to skip an extra remote fetch.
  const sha = options.sha !== undefined ? options.sha : (await fetchRemoteConfigFile())?.sha;

  const serialized = `${JSON.stringify(config, null, 2)}\n`;
  const content = Buffer.from(serialized, "utf-8").toString("base64");

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner,
    repo,
    path: CONFIG_PATH,
    message: options.message ?? "chore: update portfolio config",
    content,
    sha,
    headers: { accept: "application/vnd.github+json" }
  });
}

/**
 * Persists a fresh GitHub repo snapshot into the portfolio config.
 * Always re-fetches the remote file immediately before writing so the sha is
 * never stale. Reusing the sha from the initial page-load fetch causes 409
 * conflicts when concurrent requests have already updated the file.
 */
export async function saveCachedGithubRepos(repos: CachedGithubRepo[]): Promise<void> {
  const latest = await getPortfolioConfigWithSha();
  const updated: PortfolioConfig = {
    manualProjects: latest.manualProjects,
    order: latest.order,
    cachedGithubRepos: repos,
    cachedAt: new Date().toISOString()
  };
  await savePortfolioConfig(updated, {
    message: "chore: update cached github repo snapshot",
    sha: latest.sha ?? undefined
  });
}

export function normalizeManualProject(input: unknown): ManualProjectRecord {
  const parsed = manualProjectSchema.parse(input);
  return parsed;
}

export function defaultSourceVisibility(): ProjectSourceVisibility {
  return "private";
}

export const portfolioConfigSchemas = {
  manualProject: manualProjectSchema,
  portfolioConfig: portfolioConfigSchema
};
