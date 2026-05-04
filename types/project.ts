export type PortfolioProject = {
  id: number;
  name: string;
  fullName: string;
  description: string;
  homepageUrl: string;
  repositoryUrl: string;
  defaultBranch: string;
  language: string | null;
  topics: string[];
  pushedAt: string;
  screenshotPublicId: string;
  screenshotUrl: string | null;
};
