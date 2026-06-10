const STAT_COUNT = 4;
const stats = Array.from({ length: STAT_COUNT }, (_, i) => i);
const MSG_COUNT = 5;
const messages = Array.from({ length: MSG_COUNT }, (_, i) => i);

export const DashboardSkeleton = () => (
  <div className="flex w-full flex-col gap-6 p-6">
    <div className="flex flex-col gap-3">
      <div className="bg-muted h-8 w-72 max-w-full animate-pulse rounded" />
      <div className="bg-muted h-4 w-48 animate-pulse rounded" />
    </div>
    <div className="bg-card border-border rounded-12 flex items-center gap-4 border p-5">
      <div className="bg-muted size-12 shrink-0 animate-pulse rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="bg-muted h-3 w-32 animate-pulse rounded" />
        <div className="bg-muted h-4 w-56 max-w-full animate-pulse rounded" />
      </div>
      <div className="bg-muted rounded-8 h-9 w-24 shrink-0 animate-pulse" />
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
      <div className="border-border flex items-center justify-between border-b px-5 py-4">
        <div className="bg-muted h-5 w-40 animate-pulse rounded" />
        <div className="bg-muted h-4 w-16 animate-pulse rounded" />
      </div>
      {messages.map((i) => (
        <div
          key={i}
          className="border-border flex items-center gap-3 border-b px-5 py-4 last:border-b-0"
        >
          <div className="bg-muted size-10 shrink-0 animate-pulse rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="bg-muted h-3.5 w-36 animate-pulse rounded" />
            <div className="bg-muted h-3 w-60 max-w-full animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
