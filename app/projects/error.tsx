"use client";

import { useEffect } from "react";
import { TerminalFrame } from "@/components/terminal-frame";

type ProjectsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProjectsError({ error, reset }: ProjectsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <TerminalFrame title="~/projects/error">
      <p className="text-sm text-terminal-amber">$ cat projects.err</p>
      <h1 className="mt-3 text-2xl font-semibold text-terminal-text">Projects feed unavailable</h1>
      <p className="mt-3 max-w-2xl text-terminal-text/80">
        The project listing could not be rendered. Retry to attempt a fresh fetch.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded border border-terminal-accent px-4 py-2 text-sm text-terminal-accent hover:border-terminal-amber hover:text-terminal-amber"
      >
        retry projects
      </button>
    </TerminalFrame>
  );
}
