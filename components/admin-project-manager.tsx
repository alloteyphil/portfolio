"use client";

import { useMemo, useState } from "react";

type EditableProjectRepo = {
  id: number;
  name: string;
  fullName: string;
  description: string;
  repositoryUrl: string;
  homepageUrl: string | null;
  language: string | null;
  topics: string[];
  isVisible: boolean;
};

type RefreshResult = {
  ok: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  results: Array<{ name: string; success: boolean; error?: string }>;
  completedAt: string;
};

type AdminProjectManagerProps = {
  initialRepos: EditableProjectRepo[];
};

export function AdminProjectManager({ initialRepos }: AdminProjectManagerProps) {
  const [repos, setRepos] = useState<EditableProjectRepo[]>(initialRepos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState<RefreshResult | null>(null);
  const [savingRepo, setSavingRepo] = useState<string | null>(null);

  async function loadRepos() {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/admin/projects", { cache: "no-store" });
    const payload = (await response.json()) as { ok?: boolean; error?: string; repos?: EditableProjectRepo[] };
    if (!response.ok || !payload.ok) {
      setError(payload.error ?? "Failed to load repositories.");
      setLoading(false);
      return;
    }
    setRepos(payload.repos ?? []);
    setLoading(false);
  }

  const visibleCount = useMemo(() => repos.filter((repo) => repo.isVisible).length, [repos]);

  async function updateRepo(repo: EditableProjectRepo) {
    setSavingRepo(repo.fullName);
    setError(null);

    const response = await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: repo.fullName,
        visible: repo.isVisible,
        description: repo.description,
        homepageUrl: repo.homepageUrl,
        topics: repo.topics
      })
    });
    const payload = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !payload.ok) {
      setError(payload.error ?? "Failed to update visibility.");
    }
    setSavingRepo(null);
  }

  async function triggerRefresh() {
    setRefreshing(true);
    setError(null);
    setRefreshResult(null);
    const response = await fetch("/api/admin/refresh-screenshots", { method: "POST" });
    const payload = (await response.json()) as {
      ok?: boolean;
      error?: string;
      details?: RefreshResult;
      result?: RefreshResult;
    };

    if (!response.ok || !payload.ok) {
      const details = payload.details;
      if (details) setRefreshResult(details);
      setError(payload.error ?? "Failed to refresh screenshots.");
      setRefreshing(false);
      return;
    }

    if (payload.result) {
      setRefreshResult(payload.result);
    }
    setRefreshing(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded border border-terminal-border p-4">
        <p className="text-sm text-terminal-text/90">
          Visible projects: <span className="text-terminal-amber">{visibleCount}</span> / {repos.length}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void triggerRefresh()}
            disabled={refreshing}
            className="rounded border border-terminal-accent px-3 py-1.5 text-sm text-terminal-accent disabled:opacity-60"
          >
            {refreshing ? "Refreshing..." : "Refresh screenshots"}
          </button>
          <button
            type="button"
            onClick={() => void loadRepos()}
            disabled={loading}
            className="rounded border border-terminal-border px-3 py-1.5 text-sm text-terminal-text disabled:opacity-60"
          >
            Reload repos
          </button>
        </div>
        {refreshResult ? (
          <div className="mt-3 rounded border border-terminal-border/70 bg-black/40 p-3 text-xs">
            <p className={refreshResult.ok ? "text-green-300" : "text-red-300"}>
              {refreshResult.ok ? "Refresh completed successfully." : "Refresh completed with failures."}
            </p>
            <p className="mt-1 text-terminal-text/80">
              processed {refreshResult.processed}, succeeded {refreshResult.succeeded}, failed {refreshResult.failed}
            </p>
            <p className="mt-1 text-terminal-text/70">completed: {new Date(refreshResult.completedAt).toLocaleString()}</p>
            {refreshResult.results.some((result) => !result.success) ? (
              <div className="mt-2 space-y-1">
                {refreshResult.results
                  .filter((result) => !result.success)
                  .map((result) => (
                    <p key={result.name} className="text-red-300">
                      {result.name}: {result.error ?? "Unknown error"}
                    </p>
                  ))}
              </div>
            ) : null}
          </div>
        ) : null}
        {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-terminal-text/70">Loading repositories...</p>
        ) : repos.length === 0 ? (
          <p className="rounded border border-dashed border-terminal-border p-4 text-sm text-terminal-text/70">
            No repositories found.
          </p>
        ) : (
          repos.map((repo) => (
            <div key={repo.id} className="rounded border border-terminal-border p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-terminal-accent">{repo.fullName}</p>
                  <a
                    href={repo.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-xs text-terminal-text/70 underline"
                  >
                    {repo.repositoryUrl}
                  </a>
                </div>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={repo.isVisible}
                    onChange={(event) =>
                      setRepos((current) =>
                        current.map((item) =>
                          item.fullName === repo.fullName ? { ...item, isVisible: event.target.checked } : item
                        )
                      )
                    }
                  />
                  Visible on /projects
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-terminal-text/75">Homepage URL</label>
                  <input
                    value={repo.homepageUrl ?? ""}
                    onChange={(event) =>
                      setRepos((current) =>
                        current.map((item) =>
                          item.fullName === repo.fullName ? { ...item, homepageUrl: event.target.value } : item
                        )
                      )
                    }
                    placeholder="https://example.com"
                    className="w-full rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-terminal-text/75">Description</label>
                  <textarea
                    value={repo.description}
                    onChange={(event) =>
                      setRepos((current) =>
                        current.map((item) =>
                          item.fullName === repo.fullName ? { ...item, description: event.target.value } : item
                        )
                      )
                    }
                    rows={2}
                    className="w-full rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-terminal-text/75">Tags (comma separated)</label>
                  <input
                    value={repo.topics.join(", ")}
                    onChange={(event) =>
                      setRepos((current) =>
                        current.map((item) =>
                          item.fullName === repo.fullName
                            ? {
                                ...item,
                                topics: event.target.value
                                  .split(",")
                                  .map((topic) => topic.trim())
                                  .filter(Boolean)
                              }
                            : item
                        )
                      )
                    }
                    className="w-full rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => void updateRepo(repo)}
                    disabled={savingRepo === repo.fullName}
                    className="rounded border border-terminal-accent px-3 py-1.5 text-xs text-terminal-accent disabled:opacity-60"
                  >
                    {savingRepo === repo.fullName ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
