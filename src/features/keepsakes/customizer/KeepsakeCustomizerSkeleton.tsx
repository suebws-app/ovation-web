import { Skeleton } from "@ovation/ui/components/Skeleton";

const OPTIONS = Array.from({ length: 4 }, (_, i) => i);

export const KeepsakeCustomizerSkeleton = () => (
  <div className="relative flex min-h-0 flex-1 flex-col">
    <div className="flex w-full flex-col gap-4 pb-24">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="small-desktop:grid-cols-[1fr_360px] grid w-full grid-cols-1 gap-6">
        <div className="flex flex-col gap-4">
          <div className="rounded-16 border-border bg-card flex flex-col gap-3 border p-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-72 max-w-full" />
            <div className="mobile:grid-cols-3 grid grid-cols-2 gap-3">
              {OPTIONS.map((i) => (
                <Skeleton key={i} className="rounded-12 aspect-square w-full" />
              ))}
            </div>
          </div>
          <div className="rounded-16 border-border bg-card flex flex-col gap-3 border p-5">
            <Skeleton className="h-5 w-32" />
            <div className="flex flex-col gap-2">
              {OPTIONS.map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-4 rounded" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="small-desktop:sticky small-desktop:top-4 h-fit">
          <div className="rounded-16 border-border bg-card flex flex-col gap-4 border p-5">
            <Skeleton className="rounded-12 aspect-3/4 w-full" />
            <Skeleton className="h-6 w-32" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="border-border bg-background absolute inset-x-0 bottom-0 flex items-center justify-between border-t px-6 py-4">
      <Skeleton className="h-10 w-24 rounded-full" />
      <Skeleton className="h-10 w-32 rounded-full" />
    </div>
  </div>
);
