import { Skeleton } from "@ovation/ui/components/Skeleton";
import { Card } from "@ovation/ui/components/Card";
import { PlannerViewHeaderSkeleton } from "./PlannerViewHeaderSkeleton";

const VENDOR_CARDS = Array.from({ length: 6 }, (_, i) => i);

const VendorCardSkeleton = () => (
  <Card className="flex flex-col gap-4 p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="size-8 rounded-full" />
    </div>
    <div className="flex items-center gap-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="size-4 rounded" />
      ))}
    </div>
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-3 flex-1" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-3 flex-1" />
      </div>
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  </Card>
);

export const PlannerVendorsSkeleton = () => (
  <>
    <PlannerViewHeaderSkeleton />
    <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid gap-4">
      {VENDOR_CARDS.map((i) => (
        <VendorCardSkeleton key={i} />
      ))}
    </div>
  </>
);
