"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PageHeader } from "@/components/page-header";

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
    <PageHeader title="This page failed to load.">
      <p>Try again. If it keeps failing, the details below will help me fix it.</p>
      <pre className="mt-5 overflow-x-auto rounded-lg border border-line bg-surface px-4 py-3 font-mono text-xs text-muted sm:text-sm">
        {message}
        {error.digest ? `\ndigest: ${error.digest}` : ""}
      </pre>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn btn-solid">
          Try again
        </button>
        <Link href="/" className="btn btn-line">
          Go to the homepage
        </Link>
      </div>
    </PageHeader>
  );
}
