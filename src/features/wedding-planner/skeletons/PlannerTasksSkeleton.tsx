import { Skeleton } from "@ovation/ui/components/Skeleton";
import { Card } from "@ovation/ui/components/Card";
import { PlannerViewHeaderSkeleton } from "./PlannerViewHeaderSkeleton";

const COLUMN_TITLES = [0, 1, 2];
const CARDS_PER_COLUMN = Array.from({ length: 4 }, (_, i) => i);

const TaskCardSkeleton = () => (
  <Card className="flex flex-col gap-3 p-4">
    <div className="flex items-start justify-between gap-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="size-4 rounded" />
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
    <Skeleton className="h-3 w-1/2" />
  </Card>
);

export const PlannerTasksSkeleton = () => (
  <>
    <PlannerViewHeaderSkeleton />
    <div className="tablet:grid-cols-3 grid gap-4">
      {COLUMN_TITLES.map((col) => (
        <div key={col} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-6" />
          </div>
          <div className="flex flex-col gap-3">
            {CARDS_PER_COLUMN.map((i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </>
);
