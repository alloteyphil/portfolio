import Link from "next/link";
import { TerminalFrame } from "@/components/terminal-frame";

export default function AdminPage() {
  return (
    <TerminalFrame title="~/admin">
      <p className="text-sm text-terminal-text/85">
        Admin surface is now available at this route.
      </p>
      <p className="mt-3 text-sm text-terminal-text/85">
        Use the screenshot refresh endpoint to update project screenshots after project updates.
      </p>

      <div className="mt-6 rounded border border-terminal-border p-4 text-sm">
        <p className="text-terminal-amber">Quick links</p>
        <ul className="mt-2 space-y-1 text-terminal-text/85">
          <li>
            <Link className="underline hover:text-terminal-amber" href="/projects">
              /projects
            </Link>
          </li>
          <li>
            <Link className="underline hover:text-terminal-amber" href="/api/refresh-screenshots">
              /api/refresh-screenshots
            </Link>
          </li>
        </ul>
      </div>
    </TerminalFrame>
  );
}
