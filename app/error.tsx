"use client";

import { useEffect } from "react";
import { TerminalFrame } from "@/components/terminal-frame";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <TerminalFrame title="~/error">
      <p className="text-sm text-terminal-amber">$ cat logs/runtime.err</p>
      <h1 className="mt-3 text-2xl font-semibold text-terminal-text">Unexpected runtime error</h1>
      <p className="mt-3 max-w-2xl text-terminal-text/80">
        Something went wrong while rendering this route. Try re-running the last command.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded border border-terminal-accent px-4 py-2 text-sm text-terminal-accent hover:border-terminal-amber hover:text-terminal-amber"
      >
        retry command
      </button>
    </TerminalFrame>
  );
}
