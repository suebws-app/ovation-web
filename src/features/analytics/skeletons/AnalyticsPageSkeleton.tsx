import { Skeleton } from "@ovation/ui/components/Skeleton";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { AnalyticsSkeleton } from "../components/AnalyticsSkeleton";

export const AnalyticsPageSkeleton = () => (
  <div className="flex w-full flex-1">
    <div className="relative flex w-full min-w-0 flex-1 flex-col">
      <div className={containerClassName}>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-9 w-64 rounded-full" />
        </div>
        <AnalyticsSkeleton />
      </div>
    </div>
  </div>
);
