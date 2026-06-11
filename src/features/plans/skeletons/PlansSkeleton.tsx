const CARD_COUNT = 3;
const cards = Array.from({ length: CARD_COUNT }, (_, i) => i);
const features = Array.from({ length: 5 }, (_, i) => i);

export const PlansSkeleton = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6">
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="bg-muted h-8 w-72 max-w-full animate-pulse rounded" />
      <div className="bg-muted h-4 w-96 max-w-full animate-pulse rounded" />
    </div>
    <div className="tablet:grid-cols-3 grid grid-cols-1 gap-4">
      {cards.map((i) => (
        <div
          key={i}
          className="bg-card border-border rounded-16 flex flex-col gap-4 border p-6"
        >
          <div className="bg-muted h-5 w-24 animate-pulse rounded" />
          <div className="bg-muted h-9 w-32 animate-pulse rounded" />
          <div className="bg-muted rounded-8 h-10 w-full animate-pulse" />
          <div className="flex flex-col gap-2.5">
            {features.map((j) => (
              <div key={j} className="flex items-center gap-2">
                <div className="bg-muted size-4 shrink-0 animate-pulse rounded-full" />
                <div className="bg-muted h-3.5 w-full max-w-40 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
