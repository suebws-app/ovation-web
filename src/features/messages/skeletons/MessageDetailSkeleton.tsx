import { Skeleton } from "@ovation/ui/components/Skeleton";

export const MessageDetailSkeleton = () => (
  <div className="-mx-4 -mb-6 flex min-h-screen flex-col">
    <div className="border-border bg-card flex items-center gap-1 border-b px-4 py-3">
      <Skeleton className="h-4 w-24" />
    </div>
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <Skeleton className="rounded-16 aspect-video w-full max-w-2xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-11/12 max-w-2xl" />
        <Skeleton className="h-4 w-3/4 max-w-2xl" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
    </div>
    <div className="border-border bg-card flex items-center gap-3 border-t px-6 py-3">
      <Skeleton className="size-10 rounded-full" />
      <Skeleton className="h-2 flex-1 rounded-full" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
);
