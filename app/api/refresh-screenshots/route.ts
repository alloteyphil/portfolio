import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getPortfolioProjects } from "@/lib/projects";
import { captureScreenshot } from "@/lib/screenshotone";
import { uploadScreenshotToCloudinary } from "@/lib/cloudinary";

export const maxDuration = 300;

const PROJECT_REFRESH_CONCURRENCY = 4;
type RefreshResult = { name: string; success: boolean; error?: string };
type RefreshSummary = {
  ok: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  results: RefreshResult[];
  completedAt: string;
};
let lastRefreshSummary: RefreshSummary | null = null;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown screenshot error";
  }
}

function isAuthorized(request: NextRequest): boolean {
  if (!env.REFRESH_SCREENSHOTS_SECRET) {
    return false;
  }
  const authorization = request.headers.get("authorization");
  const bearer = authorization?.replace("Bearer ", "");
  const tokenHeader = request.headers.get("x-refresh-token");
  return bearer === env.REFRESH_SCREENSHOTS_SECRET || tokenHeader === env.REFRESH_SCREENSHOTS_SECRET;
}

async function runWithConcurrency<TItem>(
  items: readonly TItem[],
  worker: (item: TItem) => Promise<void>,
  concurrency: number
): Promise<void> {
  if (items.length === 0) return;

  let currentIndex = 0;
  const workerCount = Math.min(Math.max(concurrency, 1), items.length);

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (true) {
        const index = currentIndex;
        currentIndex += 1;
        if (index >= items.length) {
          break;
        }
        await worker(items[index]!);
      }
    })
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startedAt = Date.now();
  const missingEnv = [
    "GITHUB_TOKEN",
    "GITHUB_USERNAME",
    "SCREENSHOTONE_API_KEY",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "REFRESH_SCREENSHOTS_SECRET"
  ].filter((key) => {
    const value = process.env[key];
    return !value || value.trim() === "";
  });

  if (missingEnv.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: `Missing required env vars: ${missingEnv.join(", ")}`
      },
      { status: 500 }
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projects = await getPortfolioProjects();
  const results: RefreshResult[] = [];

  await runWithConcurrency(
    projects,
    async (project) => {
      try {
        const image = await captureScreenshot(project.homepageUrl);
        await uploadScreenshotToCloudinary(image, project.screenshotPublicId);
        results.push({ name: project.name, success: true });
      } catch (error) {
        results.push({
          name: project.name,
          success: false,
          error: getErrorMessage(error)
        });
      }
    },
    PROJECT_REFRESH_CONCURRENCY
  );

  if (env.VERCEL_DEPLOY_HOOK_URL) {
    await fetch(env.VERCEL_DEPLOY_HOOK_URL, { method: "POST" });
  }

  const failures = results.filter((result) => !result.success);
  const succeeded = results.length - failures.length;
  const summary: RefreshSummary = {
    ok: failures.length === 0,
    processed: results.length,
    succeeded,
    failed: failures.length,
    results,
    completedAt: new Date().toISOString()
  };
  lastRefreshSummary = summary;

  return NextResponse.json(
    {
      ...summary,
      durationMs: Date.now() - startedAt,
      message: summary.ok ? "Screenshot refresh completed successfully." : "Screenshot refresh completed with errors."
    },
    {
      status: failures.length === 0 ? 200 : 500
    }
  );
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/refresh-screenshots",
    method: "POST",
    isConfigured: Boolean(
      env.GITHUB_TOKEN &&
        env.GITHUB_USERNAME &&
        env.SCREENSHOTONE_API_KEY &&
        env.CLOUDINARY_CLOUD_NAME &&
        env.CLOUDINARY_API_KEY &&
        env.CLOUDINARY_API_SECRET &&
        env.REFRESH_SCREENSHOTS_SECRET
    ),
    lastRun: lastRefreshSummary
  });
}
