export type ProjectSourceKind = "github" | "manual";

export type ProjectSourceVisibility = "public" | "private";

export type PortfolioProject = {
  id: string;
  kind: ProjectSourceKind;
  name: string;
  fullName: string;
  description: string;
  homepageUrl: string;
  repositoryUrl: string | null;
  sourceVisibility: ProjectSourceVisibility;
  defaultBranch: string | null;
  language: string | null;
  topics: string[];
  pushedAt: string;
  screenshotPublicId: string;
  screenshotUrl: string | null;
};

export type ManualProjectRecord = {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  homepageUrl: string;
  repositoryUrl: string | null;
  sourceVisibility: ProjectSourceVisibility;
  language: string | null;
  topics: string[];
  createdAt: string;
};

export type PortfolioConfig = {
  manualProjects: ManualProjectRecord[];
  order: string[];
};

export function buildGithubProjectId(repoName: string): string {
  return `gh-${repoName.toLowerCase()}`;
}

export function buildManualProjectId(slug: string): string {
  return `manual-${slug.toLowerCase()}`;
}
