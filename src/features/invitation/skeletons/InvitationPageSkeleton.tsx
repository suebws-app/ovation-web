import { Skeleton } from "@ovation/ui/components/Skeleton";

export const InvitationPageSkeleton = () => (
  <div className="bg-background relative flex min-h-0 flex-1 flex-col pb-20">
    <div className="desktop:flex-row flex flex-1 flex-col">
      <div className="desktop:w-105 desktop:border-r desktop:border-b-0 border-border flex flex-col gap-6 border-b p-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="rounded-8 h-11 w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="rounded-8 h-11 w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="rounded-8 h-24 w-full" />
          </div>
        </div>
      </div>
      <div className="bg-muted/40 desktop:p-10 flex flex-1 items-center justify-center p-6">
        <Skeleton className="rounded-16 aspect-3/4 w-full max-w-md" />
      </div>
    </div>
    <div className="border-border bg-background absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t px-6 py-3">
      <Skeleton className="h-10 w-24 rounded-full" />
      <Skeleton className="h-10 w-32 rounded-full" />
    </div>
  </div>
);
