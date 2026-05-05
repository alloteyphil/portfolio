"use client";

import { useMemo, useState } from "react";
import {
  buildGithubProjectId,
  buildManualProjectId,
  type ManualProjectRecord
} from "@/types/project";
import type { EditableProjectRepo } from "@/components/admin-github-repos-section";

type Props = {
  repos: EditableProjectRepo[];
  manualProjects: ManualProjectRecord[];
  order: string[];
  onChangeOrder: (next: string[]) => void;
  onError: (message: string | null) => void;
};

type ProjectListItem = {
  id: string;
  label: string;
  subtitle: string;
  kind: "github" | "manual";
  isPrivate: boolean;
};

function buildItems(repos: EditableProjectRepo[], manualProjects: ManualProjectRecord[]): ProjectListItem[] {
  const githubItems: ProjectListItem[] = repos
    .filter((repo) => repo.isVisible && Boolean(repo.homepageUrl))
    .map((repo) => ({
      id: buildGithubProjectId(repo.name),
      label: repo.fullName,
      subtitle: repo.homepageUrl ?? "",
      kind: "github" as const,
      isPrivate: repo.isPrivate
    }));

  const manualItems: ProjectListItem[] = manualProjects.map((record) => ({
    id: buildManualProjectId(record.slug),
    label: record.fullName || record.name,
    subtitle: record.homepageUrl,
    kind: "manual" as const,
    isPrivate: record.sourceVisibility === "private"
  }));

  return [...githubItems, ...manualItems];
}

function applyOrderToItems(items: ProjectListItem[], order: readonly string[]): ProjectListItem[] {
  const indexById = new Map<string, number>();
  order.forEach((id, index) => {
    if (!indexById.has(id)) indexById.set(id, index);
  });

  return [...items].sort((a, b) => {
    const aIndex = indexById.get(a.id);
    const bIndex = indexById.get(b.id);

    if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
    if (aIndex !== undefined) return -1;
    if (bIndex !== undefined) return 1;

    return a.label.localeCompare(b.label);
  });
}

export function AdminProjectOrderSection({ repos, manualProjects, order, onChangeOrder, onError }: Props) {
  const baseItems = useMemo(() => buildItems(repos, manualProjects), [repos, manualProjects]);
  const [draft, setDraft] = useState<ProjectListItem[]>(() => applyOrderToItems(baseItems, order));
  const [snapshot, setSnapshot] = useState<{ baseItems: ProjectListItem[]; order: readonly string[] }>(() => ({
    baseItems,
    order
  }));
  const [saving, setSaving] = useState(false);

  if (snapshot.baseItems !== baseItems || snapshot.order !== order) {
    setSnapshot({ baseItems, order });
    setDraft(applyOrderToItems(baseItems, order));
  }

  const draftIds = useMemo(() => draft.map((item) => item.id), [draft]);
  const orderedIds = useMemo(() => applyOrderToItems(baseItems, order).map((item) => item.id), [baseItems, order]);
  const isDirty = useMemo(() => {
    if (draftIds.length !== orderedIds.length) return true;
    return draftIds.some((id, index) => id !== orderedIds[index]);
  }, [draftIds, orderedIds]);

  function move(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= draft.length) return;
    setDraft((current) => {
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved!);
      return next;
    });
  }

  function reset() {
    setDraft(applyOrderToItems(baseItems, order));
  }

  async function saveOrder() {
    setSaving(true);
    onError(null);

    const response = await fetch("/api/admin/projects/order", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: draftIds })
    });

    const data = (await response.json()) as { ok?: boolean; error?: string; order?: string[] };
    if (!response.ok || !data.ok) {
      onError(data.error ?? "Failed to save order.");
      setSaving(false);
      return;
    }

    onChangeOrder(data.order ?? draftIds);
    setSaving(false);
  }

  return (
    <section className="space-y-3">
      <header className="rounded border border-terminal-border p-3 sm:p-4">
        <h2 className="text-sm text-terminal-amber">Project order</h2>
        <p className="mt-1 text-xs text-terminal-text/70">
          Drag-equivalent reordering for what appears first on /projects. Use Up/Down to move items. Save to apply
          the order publicly.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={reset}
            disabled={!isDirty || saving}
            className="rounded border border-terminal-border px-3 py-1.5 text-xs text-terminal-text disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => void saveOrder()}
            disabled={!isDirty || saving}
            className="rounded border border-terminal-accent px-3 py-1.5 text-xs text-terminal-accent disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save order"}
          </button>
        </div>
      </header>

      {draft.length === 0 ? (
        <p className="rounded border border-dashed border-terminal-border p-4 text-sm text-terminal-text/70">
          No visible projects yet. Make a GitHub repo visible or add a manual project to reorder.
        </p>
      ) : (
        <ol className="space-y-2">
          {draft.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded border border-terminal-border bg-terminal-panel/30 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-6 shrink-0 text-right text-xs text-terminal-text/60">{index + 1}.</span>
                <div className="min-w-0">
                  <p className="break-words text-sm text-terminal-text">
                    <span className="text-terminal-accent">{item.label}</span>
                    <span className="ml-2 rounded border border-terminal-border/70 bg-terminal-panel/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-terminal-text/70">
                      {item.kind}
                    </span>
                    {item.isPrivate ? (
                      <span className="ml-2 rounded border border-terminal-border/70 bg-terminal-panel/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-terminal-amber">
                        private
                      </span>
                    ) : null}
                  </p>
                  {item.subtitle ? (
                    <p className="mt-0.5 truncate text-xs text-terminal-text/65">{item.subtitle}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${item.label} up`}
                  className="rounded border border-terminal-border px-2 py-1 text-xs text-terminal-text disabled:opacity-40"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === draft.length - 1}
                  aria-label={`Move ${item.label} down`}
                  className="rounded border border-terminal-border px-2 py-1 text-xs text-terminal-text disabled:opacity-40"
                >
                  Down
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
