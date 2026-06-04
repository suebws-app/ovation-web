const STAT_COUNT = 4;
const stats = Array.from({ length: STAT_COUNT }, (_, i) => i);

export const QRCodeSkeleton = () => (
  <div className="mx-auto w-full min-w-0 p-6 pb-28 tablet:pb-6">
    <div className="flex flex-col gap-2">
      <div className="bg-muted h-7 w-40 rounded animate-pulse" />
      <div className="bg-muted h-4 w-64 max-w-full rounded animate-pulse" />
    </div>
    <div className="rounded-16 border-border bg-card mt-6 flex flex-col gap-2 border p-5">
      <div className="bg-muted h-4 w-48 rounded animate-pulse" />
      <div className="bg-muted h-3 w-72 max-w-full rounded animate-pulse" />
    </div>
    <div className="mt-6 bg-card border-border rounded-16 flex flex-col items-center gap-4 border p-8">
      <div className="bg-muted size-64 max-w-full rounded-12 animate-pulse" />
      <div className="bg-muted h-9 w-40 rounded-8 animate-pulse" />
    </div>
    <div className="mt-4 bg-card border-border rounded-16 flex flex-col gap-3 border p-5">
      <div className="bg-muted h-5 w-28 rounded animate-pulse" />
      <div className="tablet:grid-cols-4 grid grid-cols-2 gap-3">
        {stats.map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="bg-muted h-3 w-16 rounded animate-pulse" />
            <div className="bg-muted h-5 w-10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
