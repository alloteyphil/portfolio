import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { requireOwnerAccess } from "@/lib/admin-auth";

export async function POST(request: Request): Promise<NextResponse> {
  const access = await requireOwnerAccess();
  if (!access.ok) {
    return NextResponse.json({ ok: false, error: access.error }, { status: access.status });
  }

  if (!env.REFRESH_SCREENSHOTS_SECRET) {
    return NextResponse.json({ ok: false, error: "REFRESH_SCREENSHOTS_SECRET is missing." }, { status: 500 });
  }

  const refreshUrl = new URL("/api/refresh-screenshots", request.url);
  const refreshResponse = await fetch(refreshUrl.toString(), {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.REFRESH_SCREENSHOTS_SECRET}`
    }
  });

  const payload = await refreshResponse.json().catch(() => null);
  if (!refreshResponse.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Screenshot refresh failed.",
        confirmation: "refresh_failed",
        details: payload
      },
      { status: refreshResponse.status }
    );
  }

  return NextResponse.json({
    ok: true,
    confirmation: "refresh_succeeded",
    result: payload
  });
}
