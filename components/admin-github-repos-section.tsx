"use client";

import { useMemo, useState } from "react";

export type EditableProjectRepo = {
  id: number;
  name: string;
  fullName: string;
  description: string;
  repositoryUrl: string;
  homepageUrl: string | null;
  language: string | null;
  topics: string[];
  isVisible: boolean;
  isPrivate: boolean;
};

type Props = {
  repos: EditableProjectRepo[];
  onChangeRepos: (repos: EditableProjectRepo[]) => void;
  loading: boolean;
  onError: (message: string | null) => void;
};

const PAGE_SIZE = 8;
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

export function AdminGithubReposSection({ repos, onChangeRepos, loading, onError }: Props) {
  const [topicDrafts, setTopicDrafts] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [savingRepo, setSavingRepo] = useState<string | null>(null);

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

  function patchRepo(fullName: string, patch: Partial<EditableProjectRepo>) {
    onChangeRepos(repos.map((item) => (item.fullName === fullName ? { ...item, ...patch } : item)));
  }

  async function updateRepo(repo: EditableProjectRepo) {
    setSavingRepo(repo.fullName);
    onError(null);
    const draftValue = topicDrafts[repo.fullName];
    const normalizedTopics = draftValue !== undefined ? normalizeTopicsFromInput(draftValue) : repo.topics;
    const normalizedTopicText = normalizedTopics.join(", ");
    patchRepo(repo.fullName, { topics: normalizedTopics });
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
      onError(payload.error ?? "Failed to update visibility.");
    }
    setSavingRepo(null);
  }

  return (
    <section className="space-y-3">
      <header className="rounded border border-terminal-border p-3 sm:p-4">
        <h2 className="text-sm text-terminal-amber">GitHub repositories</h2>
        <p className="mt-1 text-xs text-terminal-text/70">
          Toggle which GitHub repos appear on /projects. Private repos are listed but their source link is shown
          as private on the public site.
        </p>
        <label className="mt-3 mb-1 block text-xs text-terminal-text/75">Search repositories</label>
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
      </header>

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
                <p className="break-words text-sm text-terminal-accent">
                  {repo.fullName}{" "}
                  {repo.isPrivate ? (
                    <span className="ml-2 rounded border border-terminal-border/70 bg-terminal-panel/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-terminal-amber">
                      private
                    </span>
                  ) : null}
                </p>
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
                  onChange={(event) => patchRepo(repo.fullName, { isVisible: event.target.checked })}
                />
                Visible on /projects
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-terminal-text/75">Homepage URL</label>
                <input
                  value={repo.homepageUrl ?? ""}
                  onChange={(event) => patchRepo(repo.fullName, { homepageUrl: event.target.value })}
                  placeholder="https://example.com"
                  className="w-full min-w-0 rounded border border-terminal-border bg-transparent px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-terminal-text/75">Description</label>
                <textarea
                  value={repo.description}
                  onChange={(event) => patchRepo(repo.fullName, { description: event.target.value })}
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
                    patchRepo(repo.fullName, { topics: normalizedTopics });
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
    </section>
  );
}
