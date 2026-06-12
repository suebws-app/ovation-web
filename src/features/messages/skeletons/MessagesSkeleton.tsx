import { Skeleton } from "@ovation/ui/components/Skeleton";
import { TableSkeleton } from "@ovation/ui/components/Table";
import { messagesTableSkeletonColumns } from "../tableColumns";

const chips = Array.from({ length: 5 }, (_, i) => i);

const SkeletonChip = () => (
  <Skeleton className="h-8 w-24 shrink-0 rounded-full" />
);

export const MessagesSkeleton = () => (
  <div className="tablet:p-6 flex w-full flex-1 flex-col gap-6 p-4">
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((i) => (
          <SkeletonChip key={i} />
        ))}
      </div>
      <div className="rounded-16 border-border bg-card flex flex-col overflow-hidden border">
        <div className="border-border tablet:flex-row tablet:items-center tablet:flex-wrap flex flex-col gap-3 border-b px-6 py-4">
          <Skeleton className="h-5 w-28 shrink-0" />
          <div className="tablet:ml-auto tablet:min-w-0 tablet:flex-1 flex flex-wrap items-center justify-end gap-2">
            <Skeleton className="rounded-8 tablet:w-56 h-9 w-full min-w-0 flex-1" />
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <Skeleton className="h-8 w-28 shrink-0 rounded-full" />
          </div>
        </div>
        <div className="min-h-160">
          <TableSkeleton
            className="table-fixed"
            columns={messagesTableSkeletonColumns}
            rows={10}
          />
        </div>
      </div>
    </div>
  </div>
);
