import { TerminalFrame } from "@/components/terminal-frame";
import { ProjectCardSkeleton } from "@/components/ui/project-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <TerminalFrame title="~/projects">
      <Skeleton className="mb-2 h-4 w-48" />
      <Skeleton className="mb-6 h-3 w-full max-w-xl" />
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </TerminalFrame>
  );
}
