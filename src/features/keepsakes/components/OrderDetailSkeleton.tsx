import { Skeleton } from "@ovation/ui/components/Skeleton";

const OrderDetailRowSkeleton = () => (
  <div className="flex items-baseline justify-between">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-3.5 w-28" />
  </div>
);

export const OrderDetailSkeleton = () => (
  <div className="mt-4 flex flex-col gap-3">
    <OrderDetailRowSkeleton />
    <OrderDetailRowSkeleton />
    <OrderDetailRowSkeleton />
    <div>
      <Skeleton className="mb-1.5 h-3 w-16" />
      <div className="flex items-baseline justify-between">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3.5 w-14" />
      </div>
    </div>
  </div>
);
