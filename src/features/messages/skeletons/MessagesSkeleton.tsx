const ROW_COUNT = 10;
const rows = Array.from({ length: ROW_COUNT }, (_, i) => i);
const chips = Array.from({ length: 4 }, (_, i) => i);

export const MessagesSkeleton = () => (
  <div className="flex h-full w-full flex-1 overflow-hidden">
    <div className="bg-card relative flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
        <div className="border-border tablet:px-7 flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="bg-muted h-6 w-32 animate-pulse rounded" />
          <div className="bg-muted rounded-8 h-8 w-24 animate-pulse" />
        </div>
        <div className="border-border bg-card tablet:px-7 flex min-h-fit items-center gap-2 overflow-hidden border-b px-4 py-3">
          {chips.map((i) => (
            <div
              key={i}
              className="bg-muted h-7 w-20 shrink-0 animate-pulse rounded-full"
            />
          ))}
        </div>
        <div className="flex flex-col">
          {rows.map((i) => (
            <div
              key={i}
              className="border-border tablet:px-7 flex items-center gap-3 border-b px-4 py-4"
            >
              <div className="bg-muted size-10 shrink-0 animate-pulse rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="bg-muted h-3.5 w-40 animate-pulse rounded" />
                <div className="bg-muted h-3 w-64 max-w-full animate-pulse rounded" />
              </div>
              <div className="bg-muted h-3 w-12 shrink-0 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
