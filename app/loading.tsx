import { TerminalFrame } from "@/components/terminal-frame";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <TerminalFrame title="~/loading">
      <p className="text-sm text-terminal-amber">$ boot --app</p>
      <Skeleton className="mt-4 h-8 w-2/3 max-w-md" />
      <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-4 w-5/6 max-w-xl" />
      <Skeleton className="mt-2 h-4 w-4/6 max-w-lg" />
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        <Skeleton className="h-11 w-full sm:h-10 sm:w-36" rounded="sm" />
        <Skeleton className="h-11 w-full sm:h-10 sm:w-32" rounded="sm" />
      </div>
      <div className="mt-10 h-2 w-full max-w-md overflow-hidden rounded bg-terminal-border/30">
        <div className="h-full w-1/3 animate-pulse bg-terminal-accent/50" />
      </div>
    </TerminalFrame>
  );
}
