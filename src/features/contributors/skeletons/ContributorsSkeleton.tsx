import { Skeleton } from "@ovation/ui/components/Skeleton";
import { TableSkeleton } from "@ovation/ui/components/Table";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { guestsTableSkeletonColumns } from "../tableColumns";

export const ContributorsSkeleton = () => (
  <div className="flex w-full flex-1">
    <div className="relative flex w-full min-w-0 flex-1 flex-col">
      <div className={containerClassName}>
        <div className="rounded-16 border-border bg-card flex flex-col overflow-hidden border">
          <div className="border-border tablet:flex-row tablet:items-center flex flex-col gap-3 border-b px-6 py-4">
            <Skeleton className="h-5 w-28 shrink-0" />
            <div className="tablet:ml-auto flex flex-wrap items-center justify-end gap-2">
              <Skeleton className="rounded-8 tablet:w-56 h-9 w-full min-w-0 flex-1" />
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <Skeleton className="h-8 w-28 shrink-0 rounded-full" />
            </div>
          </div>
          <div className="min-h-160">
            <TableSkeleton
              className="table-fixed"
              columns={guestsTableSkeletonColumns}
              rows={10}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
