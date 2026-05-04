import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchEditableProjectRepos, updateRepoProjectSettings } from "@/lib/github";
import { requireOwnerAccess } from "@/lib/admin-auth";

const updateRepoSchema = z.object({
  fullName: z.string().min(3),
  visible: z.boolean(),
  description: z.string().max(500),
  homepageUrl: z.union([z.string().url(), z.literal(""), z.null()]),
  topics: z.array(z.string().min(1).max(50)).max(25)
});

export async function GET(): Promise<NextResponse> {
  const access = await requireOwnerAccess();
  if (!access.ok) {
    return NextResponse.json({ ok: false, error: access.error }, { status: access.status });
  }

  const repos = await fetchEditableProjectRepos();
  return NextResponse.json({ ok: true, repos });
}

export async function PATCH(request: Request): Promise<NextResponse> {
  const access = await requireOwnerAccess();
  if (!access.ok) {
    return NextResponse.json({ ok: false, error: access.error }, { status: access.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateRepoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  try {
    await updateRepoProjectSettings({
      fullName: parsed.data.fullName,
      visible: parsed.data.visible,
      description: parsed.data.description,
      homepageUrl: parsed.data.homepageUrl ? parsed.data.homepageUrl : null,
      topics: parsed.data.topics
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to update repository visibility." },
      { status: 500 }
    );
  }
}
