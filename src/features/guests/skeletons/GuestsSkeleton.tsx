import { Skeleton } from "@ovation/ui/components/Skeleton";
import { TableSkeleton } from "@ovation/ui/components/Table";
import { guestsTableSkeletonColumns } from "../tableColumns";

export const GuestsSkeleton = () => (
  <div className="w-full">
    <div className="tablet:p-6 flex flex-col gap-6 p-4">
      <div className="bg-card border-border rounded-12 overflow-hidden border">
        <div className="border-border tablet:px-6 flex items-center justify-between border-b px-4 py-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="rounded-8 h-9 w-64 max-w-full" />
        </div>
        <TableSkeleton
          className="table-fixed"
          columns={guestsTableSkeletonColumns}
          rows={8}
        />
      </div>
    </div>
  </div>
);
