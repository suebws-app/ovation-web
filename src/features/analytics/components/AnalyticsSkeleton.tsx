import { Skeleton } from "@ovation/ui/components/Skeleton";

export const AnalyticsSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="rounded-16 h-28 w-full" />
      ))}
    </div>
    <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
      <Skeleton className="rounded-16 h-80 w-full" />
      <Skeleton className="rounded-16 h-80 w-full" />
    </div>
  </div>
);
