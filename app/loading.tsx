import { TerminalFrame } from "@/components/terminal-frame";

export default function Loading() {
  return (
    <TerminalFrame title="~/loading">
      <p className="text-sm text-terminal-amber">$ boot --app</p>
      <h1 className="mt-3 text-2xl font-semibold text-terminal-text">Initializing session...</h1>
      <p className="mt-3 max-w-2xl text-terminal-text/80">Preparing portfolio output and route data.</p>
      <div className="mt-6 h-2 w-full max-w-md overflow-hidden rounded bg-terminal-border">
        <div className="h-full w-1/2 animate-pulse bg-terminal-accent" />
      </div>
    </TerminalFrame>
  );
}
