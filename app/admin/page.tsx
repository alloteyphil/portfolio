import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { TerminalFrame } from "@/components/terminal-frame";
import { AdminProjectManager } from "@/components/admin-project-manager";
import { requireOwnerAccess } from "@/lib/admin-auth";
import { fetchEditableProjectRepos } from "@/lib/github";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const access = await requireOwnerAccess();
  if (!access.ok) {
    return (
      <TerminalFrame title="~/admin">
        <p className="text-sm text-red-400">{access.error}</p>
      </TerminalFrame>
    );
  }

  const repos = await fetchEditableProjectRepos();

  return (
    <TerminalFrame title="~/admin">
      <p className="mb-4 text-sm text-terminal-text/85">
        Manage which GitHub repositories are visible on <span className="text-terminal-amber">/projects</span> and
        trigger screenshot refresh safely.
      </p>
      <AdminProjectManager initialRepos={repos} />
    </TerminalFrame>
  );
}
