"use client";

import { useCallback, useMemo, useState } from "react";
import { AdminGithubReposSection, type EditableProjectRepo } from "@/components/admin-github-repos-section";
import { AdminManualProjectsSection } from "@/components/admin-manual-projects-section";
import { AdminProjectOrderSection } from "@/components/admin-project-order-section";
import type { ManualProjectRecord } from "@/types/project";

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
  initialManualProjects: ManualProjectRecord[];
  initialOrder: string[];
};

export function AdminProjectManager({
  initialRepos,
  initialManualProjects,
  initialOrder
}: AdminProjectManagerProps) {
  const [repos, setRepos] = useState<EditableProjectRepo[]>(initialRepos);
  const [manualProjects, setManualProjects] = useState<ManualProjectRecord[]>(initialManualProjects);
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshResult, setRefreshResult] = useState<RefreshAggregate | null>(null);
  const [refreshProgress, setRefreshProgress] = useState<{ processed: number; total: number } | null>(null);

  const visibleCount = useMemo(
    () => repos.filter((repo) => repo.isVisible).length + manualProjects.length,
    [repos, manualProjects]
  );

  const reloadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/admin/projects", { cache: "no-store" });
    const payload = (await response.json()) as {
      ok?: boolean;
      error?: string;
      repos?: EditableProjectRepo[];
      manualProjects?: ManualProjectRecord[];
      order?: string[];
    };
    if (!response.ok || !payload.ok) {
      setError(payload.error ?? "Failed to load admin data.");
      setLoading(false);
      return;
    }
    setRepos(payload.repos ?? []);
    setManualProjects(payload.manualProjects ?? []);
    setOrder(payload.order ?? []);
    setLoading(false);
  }, []);

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
          Visible projects: <span className="text-terminal-amber">{visibleCount}</span> ({manualProjects.length}{" "}
          manual + {repos.filter((repo) => repo.isVisible).length} GitHub)
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
            onClick={() => void reloadAll()}
            disabled={loading}
            className="inline-flex min-h-10 items-center justify-center rounded border border-terminal-border px-3 py-2 text-sm text-terminal-text disabled:opacity-60 sm:min-h-0 sm:py-1.5"
          >
            Reload data
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
            <p className="mt-1 text-terminal-text/70">
              completed: {new Date(refreshResult.completedAt).toLocaleString()}
            </p>
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

      <AdminProjectOrderSection
        repos={repos}
        manualProjects={manualProjects}
        order={order}
        onChangeOrder={setOrder}
        onError={setError}
      />

      <AdminManualProjectsSection
        manualProjects={manualProjects}
        onChange={setManualProjects}
        onChangeOrder={setOrder}
        onError={setError}
      />

      <AdminGithubReposSection repos={repos} onChangeRepos={setRepos} loading={loading} onError={setError} />
    </div>
  );
}
