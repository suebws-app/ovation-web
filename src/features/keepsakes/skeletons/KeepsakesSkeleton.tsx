const TILE_COUNT = 6;
const tiles = Array.from({ length: TILE_COUNT }, (_, i) => i);

export const KeepsakesSkeleton = () => (
  <div className="flex w-full min-w-0 flex-col gap-6 p-6">
    <div className="bg-card border-border rounded-16 flex flex-col gap-3 border p-6">
      <div className="bg-muted h-8 w-64 max-w-full animate-pulse rounded" />
      <div className="bg-muted h-4 w-80 max-w-full animate-pulse rounded" />
    </div>
    <div className="bg-card border-border rounded-16 desktop:grid-cols-[280px_1fr] grid grid-cols-1 gap-4 border p-5">
      <div className="bg-muted rounded-12 aspect-square w-full animate-pulse" />
      <div className="flex flex-col justify-center gap-3">
        <div className="bg-muted h-6 w-48 animate-pulse rounded" />
        <div className="bg-muted h-4 w-full max-w-md animate-pulse rounded" />
        <div className="bg-muted rounded-8 h-10 w-32 animate-pulse" />
      </div>
    </div>
    <div className="bg-muted rounded-12 h-20 w-full animate-pulse" />
    <div className="flex flex-col gap-4">
      <div className="bg-muted h-6 w-40 animate-pulse rounded" />
      <div className="tablet:grid-cols-3 desktop:grid-cols-3 grid grid-cols-2 gap-4">
        {tiles.map((i) => (
          <div
            key={i}
            className="bg-card border-border rounded-12 flex flex-col gap-3 border p-3"
          >
            <div className="bg-muted rounded-8 aspect-square w-full animate-pulse" />
            <div className="bg-muted h-4 w-32 max-w-full animate-pulse rounded" />
            <div className="bg-muted h-3 w-20 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
