import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <article className="h-full min-w-0 rounded-xl border border-terminal-border/60 bg-gradient-to-b from-terminal-panel to-terminal-bg p-4 shadow-terminal sm:p-5">
      <header className="mb-4 flex items-center justify-between border-b border-terminal-border/50 pb-3">
        <div className="flex gap-2">
          <Skeleton className="h-2.5 w-2.5 rounded-full" rounded="full" />
          <Skeleton className="h-2.5 w-2.5 rounded-full" rounded="full" />
          <Skeleton className="h-2.5 w-2.5 rounded-full" rounded="full" />
        </div>
        <Skeleton className="h-3 w-24" rounded="sm" />
      </header>
      <div className="mb-4 overflow-hidden rounded-lg border border-terminal-border/50">
        <Skeleton className="h-8 w-full rounded-none" rounded="sm" />
        <Skeleton className="h-48 w-full rounded-none" rounded="sm" />
      </div>
      <Skeleton className="mb-2 h-5 w-3/4 max-w-xs" />
      <Skeleton className="mb-3 h-3 w-full" />
      <Skeleton className="mb-3 h-3 w-5/6" />
      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16" rounded="full" />
        <Skeleton className="h-6 w-20" rounded="full" />
        <Skeleton className="h-6 w-14" rounded="full" />
      </div>
      <footer className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Skeleton className="h-10 w-full sm:h-8 sm:w-20" rounded="sm" />
        <Skeleton className="h-10 w-full sm:h-8 sm:w-16" rounded="sm" />
      </footer>
    </article>
  );
}
