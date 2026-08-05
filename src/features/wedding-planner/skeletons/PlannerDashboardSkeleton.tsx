import { Skeleton } from "@ovation/ui/components/Skeleton";
import { Card } from "@ovation/ui/components/Card";

const TASK_ROWS = Array.from({ length: 3 }, (_, i) => i);
const PAYMENT_ROWS = Array.from({ length: 3 }, (_, i) => i);
const BUDGET_ROWS = Array.from({ length: 4 }, (_, i) => i);

export const PlannerDashboardSkeleton = () => (
  <div className="flex flex-col gap-5">
    <div className="desktop:grid-cols-3 grid gap-5">
      <div className="desktop:col-span-2">
        <Card className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-72 max-w-full" />
            <Skeleton className="h-4 w-56 max-w-full" />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </Card>
      </div>
      <Card className="flex items-center gap-5">
        <Skeleton className="size-24 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-2 h-4 w-24" />
        </div>
      </Card>
    </div>

    <div className="tablet:grid-cols-2 grid gap-5">
      {[TASK_ROWS, PAYMENT_ROWS].map((rows, idx) => (
        <Card key={idx}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="size-5 rounded" />
          </div>
          <div className="flex flex-col gap-3">
            {rows.map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-4 rounded" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>

    <div className="desktop:grid-cols-3 grid gap-5">
      <Card className="desktop:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mb-4 flex gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-24" />
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
        <div className="mt-4 flex flex-col gap-3">
          {BUDGET_ROWS.map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-3 rounded-full" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);
