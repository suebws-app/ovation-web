const TILE_COUNT = 18;
const tiles = Array.from({ length: TILE_COUNT }, (_, i) => i);
const chips = Array.from({ length: 4 }, (_, i) => i);

export const PhotosSkeleton = () => (
  <div className="flex h-full w-full flex-1 overflow-hidden">
    <div className="bg-card relative flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
        <div className="border-border tablet:px-7 flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-muted h-8 w-24 animate-pulse rounded-full" />
            <div className="bg-muted h-8 w-20 animate-pulse rounded-full" />
          </div>
          <div className="bg-muted rounded-8 h-8 w-40 animate-pulse" />
        </div>
        <div className="border-border bg-card tablet:px-7 flex min-h-fit items-center gap-2 overflow-hidden border-b px-4 py-3">
          {chips.map((i) => (
            <div
              key={i}
              className="bg-muted h-7 w-20 shrink-0 animate-pulse rounded-full"
            />
          ))}
        </div>
        <div className="tablet:p-7 tablet:gap-2 mobile:grid-cols-4 desktop:grid-cols-6 grid grid-cols-3 gap-1 p-2">
          {tiles.map((i) => (
            <div
              key={i}
              className="rounded-8 bg-muted aspect-square animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);
