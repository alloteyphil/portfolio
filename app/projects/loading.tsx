import { ProjectCardSkeleton } from "@/components/ui/project-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <>
      <div className="pb-12 pt-8 sm:pb-16 sm:pt-14">
        <Skeleton className="h-3 w-40" rounded="sm" />
        <Skeleton className="mt-5 h-14 w-full max-w-xl sm:h-20" />
        <Skeleton className="mt-6 h-4 w-full max-w-md" />
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
