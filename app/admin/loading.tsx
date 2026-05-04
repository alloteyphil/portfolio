import { TerminalFrame } from "@/components/terminal-frame";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <TerminalFrame title="~/admin">
      <Skeleton className="mb-4 h-4 w-full max-w-2xl" />
      <Skeleton className="mb-2 h-3 w-64" />
      <div className="mb-6 min-w-0 rounded border border-terminal-border/60 p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <Skeleton className="h-10 w-full sm:h-9 sm:w-40" rounded="sm" />
          <Skeleton className="h-10 w-full sm:h-9 sm:w-28" rounded="sm" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="min-w-0 rounded border border-terminal-border/60 p-3 sm:p-4">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-48 max-w-full" />
                <Skeleton className="h-3 w-full max-w-md" />
              </div>
              <Skeleton className="h-5 w-full shrink-0 sm:w-36 sm:self-start" rounded="sm" />
            </div>
            <Skeleton className="mb-2 h-10 w-full" />
            <Skeleton className="mb-2 h-16 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="mt-3 flex sm:justify-end">
              <Skeleton className="h-10 w-full sm:h-8 sm:w-28" rounded="sm" />
            </div>
          </div>
        ))}
      </div>
    </TerminalFrame>
  );
}
