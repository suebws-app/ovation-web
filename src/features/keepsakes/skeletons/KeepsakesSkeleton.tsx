const TILE_COUNT = 6;
const tiles = Array.from({ length: TILE_COUNT }, (_, i) => i);

export const KeepsakesSkeleton = () => (
  <div className="flex w-full min-w-0 flex-col gap-6 p-6">
    <div className="bg-card border-border rounded-16 flex flex-col gap-3 border p-6">
      <div className="bg-muted h-8 w-64 max-w-full rounded animate-pulse" />
      <div className="bg-muted h-4 w-80 max-w-full rounded animate-pulse" />
    </div>
    <div className="bg-card border-border rounded-16 grid grid-cols-1 gap-4 border p-5 desktop:grid-cols-[280px_1fr]">
      <div className="bg-muted aspect-square w-full rounded-12 animate-pulse" />
      <div className="flex flex-col gap-3 justify-center">
        <div className="bg-muted h-6 w-48 rounded animate-pulse" />
        <div className="bg-muted h-4 w-full max-w-md rounded animate-pulse" />
        <div className="bg-muted h-10 w-32 rounded-8 animate-pulse" />
      </div>
    </div>
    <div className="bg-muted rounded-12 h-20 w-full animate-pulse" />
    <div className="flex flex-col gap-4">
      <div className="bg-muted h-6 w-40 rounded animate-pulse" />
      <div className="tablet:grid-cols-3 desktop:grid-cols-3 grid grid-cols-2 gap-4">
        {tiles.map((i) => (
          <div
            key={i}
            className="bg-card border-border rounded-12 flex flex-col gap-3 border p-3"
          >
            <div className="bg-muted aspect-square w-full rounded-8 animate-pulse" />
            <div className="bg-muted h-4 w-32 max-w-full rounded animate-pulse" />
            <div className="bg-muted h-3 w-20 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
