"use client";

import { useState } from "react";
import { buildManualProjectId, type ManualProjectRecord, type ProjectSourceVisibility } from "@/types/project";

type Props = {
  manualProjects: ManualProjectRecord[];
  onChange: (next: ManualProjectRecord[]) => void;
  onChangeOrder: (next: string[] | ((current: string[]) => string[])) => void;
  onError: (message: string | null) => void;
};

type DraftState = {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  homepageUrl: string;
  repositoryUrl: string;
  sourceVisibility: ProjectSourceVisibility;
  language: string;
  topics: string;
};

const EMPTY_DRAFT: DraftState = {
  slug: "",
  name: "",
  fullName: "",
  description: "",
  homepageUrl: "",
  repositoryUrl: "",
  sourceVisibility: "private",
  language: "",
  topics: ""
};

function recordToDraft(record: ManualProjectRecord): DraftState {
  return {
    slug: record.slug,
    name: record.name,
    fullName: record.fullName,
    description: record.description,
    homepageUrl: record.homepageUrl,
    repositoryUrl: record.repositoryUrl ?? "",
    sourceVisibility: record.sourceVisibility,
    language: record.language ?? "",
    topics: record.topics.join(", ")
  };
}

function parseTopicsFromInput(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean)
    )
  );
}

export function AdminManualProjectsSection({ manualProjects, onChange, onChangeOrder, onError }: Props) {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busySlug, setBusySlug] = useState<string | null>(null);

  function startCreate() {
    setEditingSlug(null);
    setCreating(true);
    setDraft(EMPTY_DRAFT);
    onError(null);
  }

  function startEdit(record: ManualProjectRecord) {
    setEditingSlug(record.slug);
    setCreating(false);
    setDraft(recordToDraft(record));
    onError(null);
  }

  function cancelEdit() {
    setEditingSlug(null);
    setCreating(false);
    setDraft(EMPTY_DRAFT);
  }

  async function submitDraft() {
    setSaving(true);
    onError(null);

    const payload = {
      slug: draft.slug,
      name: draft.name,
      fullName: draft.fullName || draft.name,
      description: draft.description,
      homepageUrl: draft.homepageUrl,
      repositoryUrl: draft.repositoryUrl ? draft.repositoryUrl : null,
      sourceVisibility: draft.sourceVisibility,
      language: draft.language ? draft.language : null,
      topics: parseTopicsFromInput(draft.topics)
    };

    const isUpdate = Boolean(editingSlug);
    const response = await fetch("/api/admin/manual-projects", {
      method: isUpdate ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isUpdate ? { ...payload, originalSlug: editingSlug } : payload)
    });

    const data = (await response.json()) as { ok?: boolean; error?: string; project?: ManualProjectRecord };
    if (!response.ok || !data.ok || !data.project) {
      onError(data.error ?? "Failed to save manual project.");
      setSaving(false);
      return;
    }

    const saved = data.project;

    if (isUpdate && editingSlug) {
      onChange(manualProjects.map((item) => (item.slug === editingSlug ? saved : item)));
      if (editingSlug !== saved.slug) {
        const oldId = buildManualProjectId(editingSlug);
        const newId = buildManualProjectId(saved.slug);
        onChangeOrder((current) => current.map((id) => (id === oldId ? newId : id)));
      }
    } else {
      onChange([...manualProjects, saved]);
      const newId = buildManualProjectId(saved.slug);
      onChangeOrder((current) => (current.includes(newId) ? current : [...current, newId]));
    }

    setSaving(false);
    cancelEdit();
  }

  async function deleteRecord(record: ManualProjectRecord) {
    if (!window.confirm(`Delete manual project "${record.name}"? This cannot be undone.`)) return;
    setBusySlug(record.slug);
    onError(null);

    const response = await fetch("/api/admin/manual-projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: record.slug })
    });

    const data = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) {
      onError(data.error ?? "Failed to delete manual project.");
      setBusySlug(null);
      return;
    }

    const removeId = buildManualProjectId(record.slug);
    onChange(manualProjects.filter((item) => item.slug !== record.slug));
    onChangeOrder((current) => current.filter((id) => id !== removeId));

    if (editingSlug === record.slug) {
      cancelEdit();
    }
    setBusySlug(null);
  }

  const editorOpen = creating || editingSlug !== null;

  return (
    <section className="space-y-3">
      <header className="rounded border border-terminal-border p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm text-terminal-amber">Manual projects</h2>
            <p className="mt-1 text-xs text-terminal-text/70">
              Add private repositories or sites that don&apos;t live on GitHub (for example, a client&apos;s
              WordPress site). Manual projects always render on /projects.
            </p>
          </div>
          {!editorOpen ? (
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex min-h-10 items-center justify-center rounded border border-terminal-accent px-3 py-2 text-sm text-terminal-accent sm:min-h-0 sm:py-1.5"
            >
              Add manual project
            </button>
          ) : null}
        </div>
      </header>

      {editorOpen ? (
        <div className="rounded border border-terminal-accent/70 bg-terminal-panel/30 p-3 sm:p-4">
          <p className="mb-3 text-xs text-terminal-amber">
            {editingSlug ? `Editing manual project "${editingSlug}"` : "Add manual project"}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-terminal-text/75">Slug (used internally)</label>
              <input
                value={draft.slug}
                onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))}
                placeholder="client-bakery"
                className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-terminal-text/75">Display name</label>
              <input
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder="Client Bakery"
                className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-terminal-text/75">Full name (card title)</label>
              <input
                value={draft.fullName}
                onChange={(event) => setDraft((current) => ({ ...current, fullName: event.target.value }))}
                placeholder="Client Bakery / WordPress site"
                className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-terminal-text/75">Description</label>
              <textarea
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                rows={3}
                className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-terminal-text/75">Live URL</label>
              <input
                value={draft.homepageUrl}
                onChange={(event) => setDraft((current) => ({ ...current, homepageUrl: event.target.value }))}
                placeholder="https://client-site.com"
                className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-terminal-text/75">Repository URL (optional)</label>
              <input
                value={draft.repositoryUrl}
                onChange={(event) => setDraft((current) => ({ ...current, repositoryUrl: event.target.value }))}
                placeholder="https://github.com/owner/repo (optional)"
                className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-terminal-text/75">Source link visibility</label>
              <select
                value={draft.sourceVisibility}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    sourceVisibility: event.target.value as ProjectSourceVisibility
                  }))
                }
                className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
              >
                <option value="private">Private — show disabled lock badge</option>
                <option value="public">Public — link to repository URL</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-terminal-text/75">Primary language / stack</label>
              <input
                value={draft.language}
                onChange={(event) => setDraft((current) => ({ ...current, language: event.target.value }))}
                placeholder="WordPress"
                className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-terminal-text/75">Tags / tools (comma separated)</label>
              <input
                value={draft.topics}
                onChange={(event) => setDraft((current) => ({ ...current, topics: event.target.value }))}
                placeholder="wordpress, php, client"
                className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="rounded border border-terminal-border px-3 py-2 text-xs text-terminal-text disabled:opacity-60 sm:py-1.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void submitDraft()}
              disabled={saving}
              className="rounded border border-terminal-accent px-3 py-2 text-xs text-terminal-accent disabled:opacity-60 sm:py-1.5"
            >
              {saving ? "Saving..." : editingSlug ? "Save manual project" : "Create manual project"}
            </button>
          </div>
        </div>
      ) : null}

      {manualProjects.length === 0 ? (
        <p className="rounded border border-dashed border-terminal-border p-4 text-sm text-terminal-text/70">
          No manual projects yet. Use &quot;Add manual project&quot; to add a private repo or non-GitHub site.
        </p>
      ) : (
        <ul className="space-y-3">
          {manualProjects.map((record) => (
            <li key={record.slug} className="rounded border border-terminal-border p-3 sm:p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-sm text-terminal-accent">{record.fullName || record.name}</p>
                  <p className="text-xs text-terminal-text/70">
                    slug: <span className="text-terminal-amber">{record.slug}</span>
                    {record.sourceVisibility === "private" ? (
                      <span className="ml-2 rounded border border-terminal-border/70 bg-terminal-panel/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-terminal-amber">
                        private
                      </span>
                    ) : null}
                  </p>
                  <a
                    href={record.homepageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-xs text-terminal-text/70 underline"
                  >
                    {record.homepageUrl}
                  </a>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => startEdit(record)}
                    className="rounded border border-terminal-border px-3 py-1.5 text-xs text-terminal-text"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteRecord(record)}
                    disabled={busySlug === record.slug}
                    className="rounded border border-red-400/70 px-3 py-1.5 text-xs text-red-300 disabled:opacity-60"
                  >
                    {busySlug === record.slug ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
