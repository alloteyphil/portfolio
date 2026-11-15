"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/page-header";

type ProjectsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProjectsError({ error, reset }: ProjectsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageHeader title="The project list didn't load.">
      <p>The projects come from GitHub and that request failed. Trying again usually fixes it.</p>
      <button type="button" onClick={reset} className="btn btn-solid mt-8">
        Try again
      </button>
    </PageHeader>
  );
}
