const ITEM_COUNT = 3;
const items = Array.from({ length: ITEM_COUNT }, (_, i) => i);
const summaryRows = Array.from({ length: 4 }, (_, i) => i);

export const CartSkeleton = () => (
  <div className="tablet:p-6 flex w-full flex-col gap-6 p-4">
    <div className="bg-card border-border rounded-12 flex items-center justify-between border p-5">
      <div className="flex flex-col gap-2">
        <div className="bg-muted h-6 w-32 rounded animate-pulse" />
        <div className="bg-muted h-4 w-48 rounded animate-pulse" />
      </div>
      <div className="bg-muted h-9 w-9 rounded-full animate-pulse" />
    </div>
    <div className="desktop:grid-cols-[1fr_360px] grid grid-cols-1 gap-6">
      <div className="bg-card border-border rounded-12 flex flex-col border">
        {items.map((i) => (
          <div
            key={i}
            className="border-border flex items-center gap-4 border-b p-4 last:border-b-0"
          >
            <div className="bg-muted size-16 rounded-8 animate-pulse shrink-0" />
            <div className="flex flex-1 flex-col gap-2 min-w-0">
              <div className="bg-muted h-4 w-40 rounded animate-pulse" />
              <div className="bg-muted h-3 w-24 rounded animate-pulse" />
            </div>
            <div className="bg-muted h-5 w-16 rounded animate-pulse shrink-0" />
          </div>
        ))}
      </div>
      <div className="bg-card border-border rounded-12 flex flex-col gap-4 border p-5">
        <div className="bg-muted h-5 w-28 rounded animate-pulse" />
        {summaryRows.map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="bg-muted h-3.5 w-20 rounded animate-pulse" />
            <div className="bg-muted h-3.5 w-16 rounded animate-pulse" />
          </div>
        ))}
        <div className="bg-muted h-11 w-full rounded-8 animate-pulse mt-2" />
      </div>
    </div>
  </div>
);
