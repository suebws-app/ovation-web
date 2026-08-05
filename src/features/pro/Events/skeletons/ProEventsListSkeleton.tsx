import { Skeleton } from "@ovation/ui/components/Skeleton";
import { containerClassName } from "@/lib/utils/layoutClassNames";

const ROWS = Array.from({ length: 6 }, (_, i) => i);

const EventRowSkeleton = ({ isLast }: { isLast: boolean }) => (
  <div
    className={`flex items-center justify-between px-6 py-4 ${isLast ? "" : "border-border border-b"}`}
  >
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-52" />
      <Skeleton className="h-3 w-32" />
    </div>
    <Skeleton className="h-4 w-16" />
  </div>
);

export const ProEventsListSkeleton = () => (
  <div className={containerClassName}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-9 w-28 rounded-full" />
    </div>
    <div className="rounded-16 border-border bg-card border">
      {ROWS.map((i) => (
        <EventRowSkeleton key={i} isLast={i === ROWS.length - 1} />
      ))}
    </div>
  </div>
);
