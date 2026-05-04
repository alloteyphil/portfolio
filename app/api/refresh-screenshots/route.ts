import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getPortfolioProjects } from "@/lib/projects";
import { captureScreenshot } from "@/lib/screenshotone";
import { uploadScreenshotToCloudinary } from "@/lib/cloudinary";

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

export async function POST(request: NextRequest): Promise<NextResponse> {
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
  const results: Array<{ name: string; success: boolean; error?: string }> = [];

  for (const project of projects) {
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
  }

  if (env.VERCEL_DEPLOY_HOOK_URL) {
    await fetch(env.VERCEL_DEPLOY_HOOK_URL, { method: "POST" });
  }

  const failures = results.filter((result) => !result.success);
  const succeeded = results.length - failures.length;

  return NextResponse.json(
    {
      ok: failures.length === 0,
      processed: results.length,
      succeeded,
      failed: failures.length,
      results
    },
    {
      status: failures.length === 0 ? 200 : 500
    }
  );
}
