import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getPortfolioProjects } from "@/lib/projects";
import { captureScreenshot } from "@/lib/screenshotone";
import { uploadScreenshotToCloudinary } from "@/lib/cloudinary";

export const maxDuration = 60;

const DEFAULT_BATCH_LIMIT = 2;
const MAX_BATCH_LIMIT = 4;
const PROJECT_REFRESH_CONCURRENCY = 2;

type RefreshResult = { name: string; success: boolean; error?: string };
type RefreshSummary = {
  ok: boolean;
  total: number;
  offset: number;
  nextOffset: number;
  done: boolean;
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

function clampInteger(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const integer = Math.trunc(parsed);
  return Math.min(Math.max(integer, min), max);
}

async function readBatchOptions(request: NextRequest): Promise<{ offset: number; limit: number }> {
  const url = new URL(request.url);
  const queryOffset = url.searchParams.get("offset");
  const queryLimit = url.searchParams.get("limit");

  let bodyOffset: unknown;
  let bodyLimit: unknown;
  try {
    const body = await request.clone().json();
    if (body && typeof body === "object") {
      bodyOffset = (body as Record<string, unknown>).offset;
      bodyLimit = (body as Record<string, unknown>).limit;
    }
  } catch {
    // body is optional
  }

  return {
    offset: clampInteger(queryOffset ?? bodyOffset, 0, Number.MAX_SAFE_INTEGER, 0),
    limit: clampInteger(queryLimit ?? bodyLimit, 1, MAX_BATCH_LIMIT, DEFAULT_BATCH_LIMIT)
  };
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

  const { offset, limit } = await readBatchOptions(request);

  const projects = await getPortfolioProjects();
  const total = projects.length;
  const slice = projects.slice(offset, offset + limit);
  const results: RefreshResult[] = [];

  await runWithConcurrency(
    slice,
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

  const nextOffset = offset + slice.length;
  const done = nextOffset >= total;

  if (done && env.VERCEL_DEPLOY_HOOK_URL) {
    await fetch(env.VERCEL_DEPLOY_HOOK_URL, { method: "POST" });
  }

  const failures = results.filter((result) => !result.success);
  const succeeded = results.length - failures.length;
  const summary: RefreshSummary = {
    ok: failures.length === 0,
    total,
    offset,
    nextOffset,
    done,
    processed: results.length,
    succeeded,
    failed: failures.length,
    results,
    completedAt: new Date().toISOString()
  };

  if (done) {
    lastRefreshSummary = summary;
  }

  return NextResponse.json(
    {
      ...summary,
      durationMs: Date.now() - startedAt,
      message: failures.length === 0
        ? done
          ? "Screenshot refresh completed successfully."
          : `Batch processed (${nextOffset}/${total}). Continue.`
        : "Screenshot refresh completed with errors."
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
    batching: {
      defaultLimit: DEFAULT_BATCH_LIMIT,
      maxLimit: MAX_BATCH_LIMIT,
      usage: "POST { offset?: number, limit?: number }; loop until { done: true }."
    },
    lastRun: lastRefreshSummary
  });
}
