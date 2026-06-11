const STAT_COUNT = 4;
const stats = Array.from({ length: STAT_COUNT }, (_, i) => i);

export const QRCodeSkeleton = () => (
  <div className="tablet:pb-6 mx-auto w-full min-w-0 p-6 pb-28">
    <div className="flex flex-col gap-2">
      <div className="bg-muted h-7 w-40 animate-pulse rounded" />
      <div className="bg-muted h-4 w-64 max-w-full animate-pulse rounded" />
    </div>
    <div className="rounded-16 border-border bg-card mt-6 flex flex-col gap-2 border p-5">
      <div className="bg-muted h-4 w-48 animate-pulse rounded" />
      <div className="bg-muted h-3 w-72 max-w-full animate-pulse rounded" />
    </div>
    <div className="bg-card border-border rounded-16 mt-6 flex flex-col items-center gap-4 border p-8">
      <div className="bg-muted rounded-12 size-64 max-w-full animate-pulse" />
      <div className="bg-muted rounded-8 h-9 w-40 animate-pulse" />
    </div>
    <div className="bg-card border-border rounded-16 mt-4 flex flex-col gap-3 border p-5">
      <div className="bg-muted h-5 w-28 animate-pulse rounded" />
      <div className="tablet:grid-cols-4 grid grid-cols-2 gap-3">
        {stats.map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="bg-muted h-3 w-16 animate-pulse rounded" />
            <div className="bg-muted h-5 w-10 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
