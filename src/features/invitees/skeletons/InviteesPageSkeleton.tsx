import { Skeleton } from "@ovation/ui/components/Skeleton";
import { PlannerViewHeaderSkeleton } from "@/features/wedding-planner/skeletons/PlannerViewHeaderSkeleton";

const ROWS = Array.from({ length: 8 }, (_, i) => i);

const InviteeRowSkeleton = () => (
  <div className="border-border flex items-center gap-4 border-b px-4 py-3 last:border-b-0">
    <Skeleton className="size-10 shrink-0 rounded-full" />
    <div className="flex flex-1 flex-col gap-1.5">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-56 max-w-full" />
    </div>
    <Skeleton className="h-6 w-20 rounded-full" />
    <Skeleton className="size-8 rounded-full" />
  </div>
);

export const InviteesPageSkeleton = () => (
  <div className="pb-24">
    <PlannerViewHeaderSkeleton />
    <div className="desktop:flex-row flex flex-col gap-6">
      <div className="rounded-16 border-border bg-card min-w-0 flex-1 overflow-hidden border">
        <div className="border-border flex items-center gap-3 border-b px-4 py-3">
          <Skeleton className="h-9 flex-1 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        {ROWS.map((i) => (
          <InviteeRowSkeleton key={i} />
        ))}
      </div>
      <div className="desktop:w-80 desktop:shrink-0">
        <div className="rounded-16 border-border bg-card flex flex-col gap-4 border p-5">
          <Skeleton className="rounded-16 aspect-3/4 w-full" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  </div>
);
