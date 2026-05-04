"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Home, iconButtonClass, iconStroke, Terminal } from "@/components/icons";
import { TerminalFrame } from "@/components/terminal-frame";

const MAX_MESSAGE_LEN = 240;

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const message = (error?.message ?? "unknown error").slice(0, MAX_MESSAGE_LEN);

  return (
    <TerminalFrame title="~/error">
      <p className="text-terminal-accent">$ trap</p>
      <p className="mt-3 text-sm text-terminal-amber sm:text-base">
        unhandled exception — the page failed to render.
      </p>

      <pre className="mt-4 max-w-3xl overflow-x-auto rounded-md border border-terminal-border bg-terminal-panel/60 px-3 py-2 text-xs text-terminal-text/80 sm:text-sm">
        {message}
        {error.digest ? `\ndigest: ${error.digest}` : ""}
      </pre>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-terminal-accent px-4 py-2.5 text-center text-sm text-terminal-accent transition hover:bg-terminal-accent/10 sm:min-h-0"
        >
          <Terminal className={iconButtonClass} strokeWidth={iconStroke} aria-hidden />
          retry
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-terminal-amber px-4 py-2.5 text-center text-sm text-terminal-amber transition hover:bg-terminal-amber/10 sm:min-h-0"
        >
          <Home className={iconButtonClass} strokeWidth={iconStroke} aria-hidden />
          cd ~
        </Link>
      </div>
    </TerminalFrame>
  );
}
