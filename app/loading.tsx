import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pb-12 pt-8 sm:pb-16 sm:pt-14">
      <Skeleton className="h-3 w-32" rounded="sm" />
      <Skeleton className="mt-5 h-14 w-full max-w-2xl sm:h-20" />
      <Skeleton className="mt-3 h-14 w-2/3 max-w-lg sm:h-20" />
      <Skeleton className="mt-8 h-4 w-full max-w-xl" />
      <Skeleton className="mt-2 h-4 w-5/6 max-w-lg" />
    </div>
  );
}
