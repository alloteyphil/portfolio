import type { Metadata } from "next";
import Link from "next/link";
import { FolderKanban, Home, iconButtonClass, iconStroke } from "@/components/icons";
import { TerminalFrame } from "@/components/terminal-frame";

export const metadata: Metadata = {
  title: "404 — Not Found",
  robots: { index: false, follow: false }
};

export default function NotFound() {
  return (
    <TerminalFrame title="~/404">
      <p className="text-terminal-accent">$ cat $REQUEST</p>
      <p className="mt-3 text-sm text-terminal-amber sm:text-base">
        404 — No such file or directory.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-terminal-text/85 sm:text-base">
        The page you tried to open does not exist (or it was renamed and the link is stale). Try one of these
        instead:
      </p>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-terminal-accent px-4 py-2.5 text-center text-sm text-terminal-accent transition hover:bg-terminal-accent/10 sm:min-h-0"
        >
          <Home className={iconButtonClass} strokeWidth={iconStroke} aria-hidden />
          cd ~
        </Link>
        <Link
          href="/projects"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-terminal-amber px-4 py-2.5 text-center text-sm text-terminal-amber transition hover:bg-terminal-amber/10 sm:min-h-0"
        >
          <FolderKanban className={iconButtonClass} strokeWidth={iconStroke} aria-hidden />
          ls ~/projects
        </Link>
      </div>
    </TerminalFrame>
  );
}
