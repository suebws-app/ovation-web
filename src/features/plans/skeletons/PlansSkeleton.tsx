const CARDS = [0, 1];
const FEATURES = [0, 1, 2, 3];

export const PlansCardsSkeleton = () => (
  <div className="tablet:grid-cols-2 grid grid-cols-1 gap-4.5">
    {CARDS.map((i) => (
      <div
        key={i}
        className="bg-card border-border rounded-16 flex flex-col gap-5 border p-8"
      >
        <div className="flex items-baseline justify-between">
          <div className="bg-foreground/10 h-6 w-32 animate-pulse rounded" />
          <div className="flex flex-col items-end gap-1">
            <div className="bg-foreground/10 h-8 w-24 animate-pulse rounded" />
            <div className="bg-foreground/10 h-3 w-16 animate-pulse rounded" />
          </div>
        </div>
        <div className="bg-foreground/10 h-4 w-full max-w-72 animate-pulse rounded" />
        <div className="flex flex-col gap-3">
          {FEATURES.map((j) => (
            <div key={j} className="flex items-center gap-2.5">
              <div className="bg-foreground/10 size-4 shrink-0 animate-pulse rounded-full" />
              <div className="bg-foreground/10 h-3.5 w-full max-w-56 animate-pulse rounded" />
            </div>
          ))}
        </div>
        <div className="bg-primary/30 mt-auto h-11 w-full animate-pulse rounded-full" />
      </div>
    ))}
  </div>
);

export const PlansSkeleton = () => (
  <div className="bg-background min-h-[calc(100vh-89px)]">
    <div className="mx-auto max-w-310 px-14 py-14">
      <div className="mb-10 flex flex-col items-center gap-3.5 text-center">
        <div className="bg-foreground/10 h-3 w-32 animate-pulse rounded" />
        <div className="bg-foreground/10 h-10 w-96 max-w-full animate-pulse rounded" />
        <div className="bg-foreground/10 h-10 w-72 max-w-full animate-pulse rounded" />
        <div className="bg-foreground/10 mt-2 h-4 w-full max-w-140 animate-pulse rounded" />
      </div>
      <PlansCardsSkeleton />
    </div>
  </div>
);
