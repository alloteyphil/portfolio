import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOwnerAccess } from "@/lib/admin-auth";
import { getPortfolioConfig, savePortfolioConfig } from "@/lib/portfolio-config";

const orderSchema = z.object({
  order: z.array(z.string().min(1).max(120)).max(200)
});

export async function PUT(request: Request): Promise<NextResponse> {
  const access = await requireOwnerAccess();
  if (!access.ok) {
    return NextResponse.json({ ok: false, error: access.error }, { status: access.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid order payload." },
      { status: 400 }
    );
  }

  try {
    const config = await getPortfolioConfig();
    const dedupedOrder = Array.from(new Set(parsed.data.order));

    await savePortfolioConfig(
      { manualProjects: config.manualProjects, order: dedupedOrder },
      { message: "chore: update portfolio project order" }
    );

    return NextResponse.json({ ok: true, order: dedupedOrder });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to save project order." },
      { status: 500 }
    );
  }
}
