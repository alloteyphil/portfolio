import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getPortfolioProjects } from "@/lib/projects";
import { captureScreenshot } from "@/lib/screenshotone";
import { uploadScreenshotToCloudinary } from "@/lib/cloudinary";

function isAuthorized(request: NextRequest): boolean {
  const authorization = request.headers.get("authorization");
  const bearer = authorization?.replace("Bearer ", "");
  const tokenHeader = request.headers.get("x-refresh-token");
  return bearer === env.REFRESH_SCREENSHOTS_SECRET || tokenHeader === env.REFRESH_SCREENSHOTS_SECRET;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
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
        error: error instanceof Error ? error.message : "Unknown screenshot error"
      });
    }
  }

  if (env.VERCEL_DEPLOY_HOOK_URL) {
    await fetch(env.VERCEL_DEPLOY_HOOK_URL, { method: "POST" });
  }

  const failures = results.filter((result) => !result.success);
  return NextResponse.json({
    ok: failures.length === 0,
    processed: results.length,
    failed: failures.length,
    results
  });
}
