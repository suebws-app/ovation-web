const ROW_COUNT = 8;
const rows = Array.from({ length: ROW_COUNT }, (_, i) => i);
const stats = Array.from({ length: 4 }, (_, i) => i);

export const GuestsSkeleton = () => (
  <div className="w-full">
    <div className="tablet:p-6 flex flex-col gap-6 p-4">
      <div className="bg-card border-border rounded-12 flex flex-col gap-4 border p-6">
        <div className="bg-muted h-6 w-48 animate-pulse rounded" />
        <div className="bg-muted h-4 w-72 max-w-full animate-pulse rounded" />
        <div className="bg-muted rounded-8 h-10 w-full max-w-md animate-pulse" />
      </div>
      <div className="tablet:grid-cols-4 grid grid-cols-2 gap-3">
        {stats.map((i) => (
          <div
            key={i}
            className="bg-card border-border rounded-12 flex flex-col gap-2 border p-4"
          >
            <div className="bg-muted h-3 w-20 animate-pulse rounded" />
            <div className="bg-muted h-6 w-12 animate-pulse rounded" />
          </div>
        ))}
      </div>
      <div className="bg-card border-border rounded-12 overflow-hidden border">
        <div className="border-border tablet:px-6 flex items-center justify-between border-b px-4 py-4">
          <div className="bg-muted h-5 w-32 animate-pulse rounded" />
          <div className="bg-muted rounded-8 h-9 w-64 max-w-full animate-pulse" />
        </div>
        {rows.map((i) => (
          <div
            key={i}
            className="border-border tablet:px-6 flex items-center gap-3 border-b px-4 py-4 last:border-b-0"
          >
            <div className="bg-muted size-10 shrink-0 animate-pulse rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="bg-muted h-3.5 w-40 animate-pulse rounded" />
              <div className="bg-muted h-3 w-56 max-w-full animate-pulse rounded" />
            </div>
            <div className="bg-muted h-6 w-16 shrink-0 animate-pulse rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
