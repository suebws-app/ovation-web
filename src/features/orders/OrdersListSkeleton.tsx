import { Skeleton } from "@ovation/ui/components/Skeleton";

const OrderCardSkeleton = () => (
  <div className="rounded-16 border-border bg-card flex w-full flex-col gap-3 border p-4">
    <div className="flex items-baseline justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-2/5" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="flex items-baseline justify-between gap-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-10" />
    </div>
    <Skeleton className="h-1 w-full rounded-full" />
  </div>
);

type OrdersListSkeletonProps = {
  rows?: number;
};

export const OrdersListSkeleton = ({ rows = 4 }: OrdersListSkeletonProps) => (
  <>
    <div className="flex flex-col gap-1">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-9 w-40" />
    </div>
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  </>
);
