import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { requireOwnerAccess } from "@/lib/admin-auth";

export const maxDuration = 60;

type BatchSummary = {
  ok: boolean;
  total: number;
  offset: number;
  nextOffset: number;
  done: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  results: Array<{ name: string; success: boolean; error?: string }>;
};

export async function POST(request: Request): Promise<NextResponse> {
  const access = await requireOwnerAccess();
  if (!access.ok) {
    return NextResponse.json({ ok: false, error: access.error }, { status: access.status });
  }

  if (!env.REFRESH_SCREENSHOTS_SECRET) {
    return NextResponse.json({ ok: false, error: "REFRESH_SCREENSHOTS_SECRET is missing." }, { status: 500 });
  }

  let offset = 0;
  let limit = 2;
  try {
    const body = await request.clone().json();
    if (body && typeof body === "object") {
      const candidate = body as Record<string, unknown>;
      if (typeof candidate.offset === "number") offset = Math.max(0, Math.trunc(candidate.offset));
      if (typeof candidate.limit === "number") limit = Math.min(4, Math.max(1, Math.trunc(candidate.limit)));
    }
  } catch {
    // empty body is allowed
  }

  const refreshUrl = new URL("/api/refresh-screenshots", request.url);
  const refreshResponse = await fetch(refreshUrl.toString(), {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.REFRESH_SCREENSHOTS_SECRET}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({ offset, limit })
  });

  const payload = (await refreshResponse.json().catch(() => null)) as BatchSummary | null;

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
    confirmation: payload?.done ? "refresh_succeeded" : "refresh_batch_succeeded",
    result: payload
  });
}
