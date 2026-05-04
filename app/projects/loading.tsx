import { TerminalFrame } from "@/components/terminal-frame";

export default function ProjectsLoading() {
  return (
    <TerminalFrame title="~/projects/loading">
      <p className="text-sm text-terminal-amber">$ fetch featured-projects</p>
      <h1 className="mt-3 text-2xl font-semibold text-terminal-text">Loading project index...</h1>
      <p className="mt-3 max-w-2xl text-terminal-text/80">
        Syncing featured repository metadata and screenshot references.
      </p>
    </TerminalFrame>
  );
}
