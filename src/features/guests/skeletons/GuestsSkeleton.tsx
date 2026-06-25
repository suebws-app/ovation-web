import { Card } from "@ovation/ui/components/Card";
import { Skeleton } from "@ovation/ui/components/Skeleton";
import { TableSkeleton } from "@ovation/ui/components/Table";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { guestsTableSkeletonColumns } from "../tableColumns";

export const GuestsSkeleton = () => (
  <div className={containerClassName}>
    <Card className="overflow-hidden">
      <div className="border-border tablet:px-6 flex items-center justify-between border-b px-4 py-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="rounded-8 h-9 w-64 max-w-full" />
      </div>
      <TableSkeleton
        className="table-fixed"
        columns={guestsTableSkeletonColumns}
        rows={8}
      />
    </Card>
  </div>
);
