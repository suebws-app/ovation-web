import { Skeleton } from "@ovation/ui/components/Skeleton";
import { Card } from "@ovation/ui/components/Card";
import { PlannerViewHeaderSkeleton } from "./PlannerViewHeaderSkeleton";

const PHASES = Array.from({ length: 4 }, (_, i) => i);
const TASKS_PER_PHASE = Array.from({ length: 3 }, (_, i) => i);

const PhaseSkeleton = () => (
  <div className="relative">
    <div className="bg-muted-foreground/40 absolute top-2 -left-6 size-3 rounded-full" />
    <div className="mb-3 flex items-center gap-3">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="flex flex-col gap-3">
      {TASKS_PER_PHASE.map((i) => (
        <Card key={i} className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="size-4 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export const PlannerTimelineSkeleton = () => (
  <>
    <PlannerViewHeaderSkeleton />
    <div className="relative pl-8">
      <div className="bg-border absolute top-2 bottom-2 left-2.5 w-0.5" />
      <div className="flex flex-col gap-8">
        {PHASES.map((i) => (
          <PhaseSkeleton key={i} />
        ))}
      </div>
    </div>
  </>
);
