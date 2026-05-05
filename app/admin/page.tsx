import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { TerminalFrame } from "@/components/terminal-frame";
import { AdminProjectManager } from "@/components/admin-project-manager";
import { requireOwnerAccess } from "@/lib/admin-auth";
import { fetchEditableProjectRepos } from "@/lib/github";
import { getPortfolioConfigWithSha } from "@/lib/portfolio-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const [repos, config] = await Promise.all([fetchEditableProjectRepos(), getPortfolioConfigWithSha()]);

  return (
    <TerminalFrame title="~/admin">
      <p className="mb-4 text-sm text-terminal-text/85">
        Manage repositories visible on <span className="text-terminal-amber">/projects</span>, add manual entries
        (private repos or non-GitHub sites), and reorder how they appear.
      </p>
      <AdminProjectManager
        initialRepos={repos}
        initialManualProjects={config.manualProjects}
        initialOrder={config.order}
      />
    </TerminalFrame>
  );
}
