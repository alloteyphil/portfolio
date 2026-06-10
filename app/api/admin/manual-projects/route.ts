import { NextResponse } from "next/server";
import { z } from "zod";
import { requireOwnerAccess } from "@/lib/admin-auth";
import { getPortfolioConfig, savePortfolioConfig } from "@/lib/portfolio-config";
import { buildManualProjectId, type ManualProjectRecord } from "@/types/project";

const SLUG_MAX_LENGTH = 60;
const TOPIC_MAX_LENGTH = 50;
const TOPIC_MAX_COUNT = 25;
const DESCRIPTION_MAX_LENGTH = 500;

function normalizeSlug(value: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH);
  return cleaned;
}

function normalizeTopic(topic: string): string {
  const cleaned = topic
    .trim()
    .toLowerCase()
    .replace(/,+/g, "-")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .slice(0, TOPIC_MAX_LENGTH);

  return /^[a-z0-9]/.test(cleaned) ? cleaned : "";
}

function normalizeTopics(values: readonly string[]): string[] {
  const sanitized = values
    .map((topic) => normalizeTopic(topic))
    .filter(Boolean)
    .filter((topic) => topic.length <= TOPIC_MAX_LENGTH);
  return Array.from(new Set(sanitized));
}

function normalizeOptionalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed).toString();
  } catch {
    try {
      return new URL(`https://${trimmed}`).toString();
    } catch {
      throw new Error("Repository URL must be a valid URL.");
    }
  }
}

function normalizeRequiredUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Homepage URL is required.");
  }
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

const sourceVisibilitySchema = z.union([z.literal("public"), z.literal("private")]);

const createSchema = z.object({
  slug: z.string().min(1).max(SLUG_MAX_LENGTH),
  name: z.string().min(1).max(120),
  fullName: z.string().min(1).max(160),
  description: z.string().max(DESCRIPTION_MAX_LENGTH).default(""),
  homepageUrl: z.string().min(1),
  repositoryUrl: z.union([z.string(), z.null()]).optional(),
  sourceVisibility: sourceVisibilitySchema.default("private"),
  language: z.union([z.string().max(80), z.null()]).optional(),
  topics: z.array(z.string()).max(TOPIC_MAX_COUNT).default([])
});

const updateSchema = createSchema.extend({
  originalSlug: z.string().min(1).max(SLUG_MAX_LENGTH)
});

const deleteSchema = z.object({
  slug: z.string().min(1).max(SLUG_MAX_LENGTH)
});

function buildRecordFromInput(input: z.infer<typeof createSchema>, createdAt: string): ManualProjectRecord {
  const slug = normalizeSlug(input.slug);
  if (!slug) {
    throw new Error("Slug must contain at least one alphanumeric character.");
  }

  const homepageUrl = normalizeRequiredUrl(input.homepageUrl);
  const repositoryUrl = normalizeOptionalUrl(input.repositoryUrl ?? null);
  const topics = normalizeTopics(input.topics);

  return {
    slug,
    name: input.name.trim(),
    fullName: input.fullName.trim(),
    description: input.description.trim(),
    homepageUrl,
    repositoryUrl,
    sourceVisibility: input.sourceVisibility,
    language: input.language?.trim() ? input.language.trim() : null,
    topics,
    createdAt
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  const access = await requireOwnerAccess();
  if (!access.ok) {
    return NextResponse.json({ ok: false, error: access.error }, { status: access.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid manual project payload." },
      { status: 400 }
    );
  }

  try {
    const config = await getPortfolioConfig();
    const record = buildRecordFromInput(parsed.data, new Date().toISOString());
    if (config.manualProjects.some((existing) => existing.slug === record.slug)) {
      return NextResponse.json(
        { ok: false, error: `A manual project with slug "${record.slug}" already exists.` },
        { status: 409 }
      );
    }

    const nextManual = [...config.manualProjects, record];
    const orderedId = buildManualProjectId(record.slug);
    const nextOrder = config.order.includes(orderedId) ? config.order : [...config.order, orderedId];

    await savePortfolioConfig(
      { ...config, manualProjects: nextManual, order: nextOrder },
      { message: `chore: add manual project ${record.slug}` }
    );

    return NextResponse.json({ ok: true, project: record });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to create manual project." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  const access = await requireOwnerAccess();
  if (!access.ok) {
    return NextResponse.json({ ok: false, error: access.error }, { status: access.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid manual project payload." },
      { status: 400 }
    );
  }

  try {
    const config = await getPortfolioConfig();
    const originalSlug = normalizeSlug(parsed.data.originalSlug);
    const existing = config.manualProjects.find((item) => item.slug === originalSlug);
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: `Manual project "${originalSlug}" was not found.` },
        { status: 404 }
      );
    }

    const updated = buildRecordFromInput(parsed.data, existing.createdAt);
    if (updated.slug !== originalSlug && config.manualProjects.some((item) => item.slug === updated.slug)) {
      return NextResponse.json(
        { ok: false, error: `A manual project with slug "${updated.slug}" already exists.` },
        { status: 409 }
      );
    }

    const nextManual = config.manualProjects.map((item) => (item.slug === originalSlug ? updated : item));

    let nextOrder = config.order;
    if (updated.slug !== originalSlug) {
      const oldId = buildManualProjectId(originalSlug);
      const newId = buildManualProjectId(updated.slug);
      nextOrder = config.order.map((id) => (id === oldId ? newId : id));
    }

    await savePortfolioConfig(
      { ...config, manualProjects: nextManual, order: nextOrder },
      { message: `chore: update manual project ${updated.slug}` }
    );

    return NextResponse.json({ ok: true, project: updated });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to update manual project." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const access = await requireOwnerAccess();
  if (!access.ok) {
    return NextResponse.json({ ok: false, error: access.error }, { status: access.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid delete payload." },
      { status: 400 }
    );
  }

  try {
    const config = await getPortfolioConfig();
    const slug = normalizeSlug(parsed.data.slug);
    const existed = config.manualProjects.some((item) => item.slug === slug);
    if (!existed) {
      return NextResponse.json(
        { ok: false, error: `Manual project "${slug}" was not found.` },
        { status: 404 }
      );
    }

    const removeId = buildManualProjectId(slug);
    const nextManual = config.manualProjects.filter((item) => item.slug !== slug);
    const nextOrder = config.order.filter((id) => id !== removeId);

    await savePortfolioConfig(
      { ...config, manualProjects: nextManual, order: nextOrder },
      { message: `chore: remove manual project ${slug}` }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to delete manual project." },
      { status: 500 }
    );
  }
}
