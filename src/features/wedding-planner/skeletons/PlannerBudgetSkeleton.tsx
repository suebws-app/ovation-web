import { Skeleton } from "@ovation/ui/components/Skeleton";
import { Card } from "@ovation/ui/components/Card";
import { PlannerViewHeaderSkeleton } from "./PlannerViewHeaderSkeleton";

const CATEGORIES = Array.from({ length: 6 }, (_, i) => i);
const PAYMENTS = Array.from({ length: 4 }, (_, i) => i);

export const PlannerBudgetSkeleton = () => (
  <>
    <PlannerViewHeaderSkeleton />
    <div className="flex flex-col gap-5">
      <Card>
        <div className="mb-4 flex flex-wrap gap-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
      </Card>
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        <div className="divide-border flex flex-col divide-y">
          {CATEGORIES.map((i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        <div className="divide-border flex flex-col divide-y">
          {PAYMENTS.map((i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  </>
);
