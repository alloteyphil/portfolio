"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-terminal-bg px-5 py-8 font-mono text-terminal-text">
        <main className="mx-auto w-full max-w-3xl rounded-xl border border-terminal-border bg-black/40 p-6">
          <p className="text-sm text-terminal-amber">$ kernel panic --ui</p>
          <h1 className="mt-3 text-2xl font-semibold">Global application error</h1>
          <p className="mt-3 text-terminal-text/80">
            A root-level rendering failure occurred. Reload the UI or run recovery.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded border border-terminal-accent px-4 py-2 text-sm text-terminal-accent hover:border-terminal-amber hover:text-terminal-amber"
          >
            reset application
          </button>
        </main>
      </body>
    </html>
  );
}
