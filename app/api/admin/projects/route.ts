import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchEditableProjectRepos, updateRepoProjectSettings } from "@/lib/github";
import { requireOwnerAccess } from "@/lib/admin-auth";

const TOPIC_MAX_LENGTH = 50;
const TOPIC_MAX_COUNT = 25;

function normalizeHomepageUrl(value: string | null): string | null {
  if (value === null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed).toString();
  } catch {
    try {
      return new URL(`https://${trimmed}`).toString();
    } catch {
      throw new Error("Homepage URL must be a valid URL.");
    }
  }
}

function normalizeTopics(value: unknown): string[] {
  const rawTopics = Array.isArray(value) ? value : [];
  const sanitized = rawTopics
    .map((topic) => (typeof topic === "string" ? topic.trim().toLowerCase() : ""))
    .filter(Boolean)
    .map((topic) => topic.replace(/\s+/g, "-"))
    .filter((topic) => topic.length <= TOPIC_MAX_LENGTH);

  return Array.from(new Set(sanitized));
}

const updateRepoSchema = z.object({
  fullName: z.string().min(3),
  visible: z.boolean(),
  description: z.string().max(5000),
  homepageUrl: z.union([z.string(), z.null()]),
  topics: z.array(z.string().min(1).max(TOPIC_MAX_LENGTH)).max(TOPIC_MAX_COUNT)
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
  const parsed = updateRepoSchema.safeParse({
    fullName: body?.fullName,
    visible: body?.visible,
    description: body?.description,
    homepageUrl: body?.homepageUrl,
    topics: normalizeTopics(body?.topics)
  });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json({ ok: false, error: firstIssue?.message ?? "Invalid payload." }, { status: 400 });
  }

  try {
    const homepageUrl = normalizeHomepageUrl(parsed.data.homepageUrl);
    await updateRepoProjectSettings({
      fullName: parsed.data.fullName,
      visible: parsed.data.visible,
      description: parsed.data.description,
      homepageUrl,
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
