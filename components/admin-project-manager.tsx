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

type RefreshBatchResult = {
  ok: boolean;
  total: number;
  offset: number;
  nextOffset: number;
  done: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  results: Array<{ name: string; success: boolean; error?: string }>;
  completedAt: string;
};

type RefreshAggregate = {
  ok: boolean;
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  results: Array<{ name: string; success: boolean; error?: string }>;
  completedAt: string;
  done: boolean;
};

type AdminProjectManagerProps = {
  initialRepos: EditableProjectRepo[];
};

const TOPIC_MAX_LENGTH = 50;

function normalizeTopicForDisplay(topic: string): string {
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

function normalizeTopicsFromInput(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((topic) => normalizeTopicForDisplay(topic))
        .filter(Boolean)
    )
  );
}

export function AdminProjectManager({ initialRepos }: AdminProjectManagerProps) {
  const [repos, setRepos] = useState<EditableProjectRepo[]>(initialRepos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topicDrafts, setTopicDrafts] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState<RefreshAggregate | null>(null);
  const [refreshProgress, setRefreshProgress] = useState<{ processed: number; total: number } | null>(null);
  const [savingRepo, setSavingRepo] = useState<string | null>(null);
  const PAGE_SIZE = 8;

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
    setTopicDrafts({});
    setCurrentPage(1);
    setLoading(false);
  }

  const visibleCount = useMemo(() => repos.filter((repo) => repo.isVisible).length, [repos]);
  const filteredRepos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return repos;
    return repos.filter((repo) => {
      return (
        repo.name.toLowerCase().includes(query) ||
        repo.fullName.toLowerCase().includes(query) ||
        repo.description.toLowerCase().includes(query) ||
        repo.topics.some((topic) => topic.toLowerCase().includes(query))
      );
    });
  }, [repos, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRepos.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginatedRepos = filteredRepos.slice(pageStart, pageStart + PAGE_SIZE);

  async function updateRepo(repo: EditableProjectRepo) {
    setSavingRepo(repo.fullName);
    setError(null);
    const draftValue = topicDrafts[repo.fullName];
    const normalizedTopics = draftValue !== undefined ? normalizeTopicsFromInput(draftValue) : repo.topics;
    const normalizedTopicText = normalizedTopics.join(", ");
    setRepos((current) =>
      current.map((item) => (item.fullName === repo.fullName ? { ...item, topics: normalizedTopics } : item))
    );
    setTopicDrafts((current) => ({ ...current, [repo.fullName]: normalizedTopicText }));

    const response = await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: repo.fullName,
        visible: repo.isVisible,
        description: repo.description,
        homepageUrl: repo.homepageUrl,
        topics: normalizedTopics
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
    setRefreshProgress(null);

    const aggregate: RefreshAggregate = {
      ok: true,
      total: 0,
      processed: 0,
      succeeded: 0,
      failed: 0,
      results: [],
      completedAt: new Date().toISOString(),
      done: false
    };

    let offset = 0;
    const MAX_BATCHES = 25;

    for (let batch = 0; batch < MAX_BATCHES; batch += 1) {
      const response = await fetch("/api/admin/refresh-screenshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offset, limit: 2 })
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        details?: RefreshBatchResult;
        result?: RefreshBatchResult;
      };

      const batchResult = payload.result ?? payload.details ?? null;

      if (batchResult) {
        aggregate.total = batchResult.total;
        aggregate.processed += batchResult.processed;
        aggregate.succeeded += batchResult.succeeded;
        aggregate.failed += batchResult.failed;
        aggregate.results = aggregate.results.concat(batchResult.results);
        aggregate.completedAt = batchResult.completedAt;
        aggregate.done = batchResult.done;
        setRefreshProgress({ processed: aggregate.processed, total: aggregate.total });
      }

      if (!response.ok || !payload.ok) {
        aggregate.ok = false;
        if (batchResult) setRefreshResult({ ...aggregate });
        setError(payload.error ?? "Failed to refresh screenshots.");
        setRefreshing(false);
        return;
      }

      if (!batchResult) {
        setError("Unexpected refresh response.");
        setRefreshing(false);
        return;
      }

      if (batchResult.failed > 0) {
        aggregate.ok = false;
      }

      if (batchResult.done) {
        setRefreshResult({ ...aggregate });
        setRefreshing(false);
        return;
      }

      offset = batchResult.nextOffset;
    }

    setError("Refresh stopped after too many batches. Try again.");
    setRefreshResult({ ...aggregate });
    setRefreshing(false);
  }

  return (
    <div className="space-y-6">
      <div className="min-w-0 rounded border border-terminal-border p-3 sm:p-4">
        <p className="text-sm text-terminal-text/90">
          Visible projects: <span className="text-terminal-amber">{visibleCount}</span> / {repos.length}
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <button
            type="button"
            onClick={() => void triggerRefresh()}
            disabled={refreshing}
            className="inline-flex min-h-10 items-center justify-center rounded border border-terminal-accent px-3 py-2 text-sm text-terminal-accent disabled:opacity-60 sm:min-h-0 sm:py-1.5"
          >
            {refreshing
              ? refreshProgress
                ? `Refreshing... (${refreshProgress.processed}/${refreshProgress.total})`
                : "Refreshing..."
              : "Refresh screenshots"}
          </button>
          <button
            type="button"
            onClick={() => void loadRepos()}
            disabled={loading}
            className="inline-flex min-h-10 items-center justify-center rounded border border-terminal-border px-3 py-2 text-sm text-terminal-text disabled:opacity-60 sm:min-h-0 sm:py-1.5"
          >
            Reload repos
          </button>
        </div>
        {refreshResult ? (
          <div className="mt-3 rounded border border-terminal-border/70 bg-terminal-panel/50 p-3 text-xs">
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
        <div className="rounded border border-terminal-border p-3 sm:p-4">
          <label className="mb-1 block text-xs text-terminal-text/75">Search repositories</label>
          <input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, owner/repo, description, or tag"
            className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
          />
          <p className="mt-2 text-xs text-terminal-text/70">
            Showing {paginatedRepos.length} of {filteredRepos.length} matching repositories ({repos.length} total).
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-terminal-text/70">Loading repositories...</p>
        ) : repos.length === 0 ? (
          <p className="rounded border border-dashed border-terminal-border p-4 text-sm text-terminal-text/70">
            No repositories found.
          </p>
        ) : filteredRepos.length === 0 ? (
          <p className="rounded border border-dashed border-terminal-border p-4 text-sm text-terminal-text/70">
            No repositories match your search.
          </p>
        ) : (
          paginatedRepos.map((repo) => (
            <div key={repo.id} className="min-w-0 rounded border border-terminal-border p-3 sm:p-4">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-sm text-terminal-accent">{repo.fullName}</p>
                  <a
                    href={repo.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-xs text-terminal-text/70 underline"
                  >
                    {repo.repositoryUrl}
                  </a>
                </div>
                <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs sm:justify-end">
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
                    className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
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
                    className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-terminal-text/75">Tools (comma separated)</label>
                  <input
                    value={topicDrafts[repo.fullName] ?? repo.topics.join(", ")}
                    onChange={(event) =>
                      setTopicDrafts((current) => ({
                        ...current,
                        [repo.fullName]: event.target.value
                      }))
                    }
                    onBlur={() => {
                      const draftValue = topicDrafts[repo.fullName];
                      if (draftValue === undefined) return;
                      const normalizedTopics = normalizeTopicsFromInput(draftValue);
                      const normalizedTopicText = normalizedTopics.join(", ");
                      setRepos((current) =>
                        current.map((item) =>
                          item.fullName === repo.fullName ? { ...item, topics: normalizedTopics } : item
                        )
                      );
                      setTopicDrafts((current) => ({
                        ...current,
                        [repo.fullName]: normalizedTopicText
                      }));
                    }}
                    className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
                  />
                  <p className="mt-1 text-xs text-terminal-text/65">
                    Spaces and commas are converted to hyphens automatically (example: react native to react-native).
                  </p>
                </div>

                <div className="flex justify-stretch sm:justify-end">
                  <button
                    type="button"
                    onClick={() => void updateRepo(repo)}
                    disabled={savingRepo === repo.fullName}
                    className="w-full rounded border border-terminal-accent px-3 py-2.5 text-xs text-terminal-accent disabled:opacity-60 sm:w-auto sm:py-1.5"
                  >
                    {savingRepo === repo.fullName ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {filteredRepos.length > 0 ? (
          <div className="flex flex-col gap-2 rounded border border-terminal-border p-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <p className="text-terminal-text/75">
              Page {safePage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safePage === 1}
                className="rounded border border-terminal-border px-3 py-1.5 text-terminal-text disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safePage === totalPages}
                className="rounded border border-terminal-accent px-3 py-1.5 text-terminal-accent disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
