import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="min-w-0">
      <Skeleton className="aspect-2/1 w-full" rounded="lg" />
      <div className="flex items-center justify-between pt-5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-24" rounded="sm" />
      </div>
      <Skeleton className="mt-3 h-3.5 w-full" />
      <Skeleton className="mt-2 h-3.5 w-5/6" />
      <div className="mt-4 flex gap-3">
        <Skeleton className="h-3 w-14" rounded="sm" />
        <Skeleton className="h-3 w-16" rounded="sm" />
        <Skeleton className="h-3 w-12" rounded="sm" />
      </div>
    </div>
  );
}
