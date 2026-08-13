import { Skeleton } from "@ovation/ui/components/Skeleton";

type PlannerViewHeaderSkeletonProps = {
  actionWidth?: string;
};

export const PlannerViewHeaderSkeleton = ({
  actionWidth = "w-36",
}: PlannerViewHeaderSkeletonProps) => (
  <div className="tablet:flex-row tablet:items-end tablet:justify-between mb-6 flex flex-col gap-3">
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
    <Skeleton className={`h-9 rounded-full ${actionWidth}`} />
  </div>
);
