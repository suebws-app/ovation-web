const CARDS = [0, 1];

export const RolePageCardsSkeleton = () => (
  <div className="tablet:grid-cols-2 tablet:mt-10 tablet:gap-5 mt-5 grid grid-cols-1 gap-3">
    {CARDS.map((i) => (
      <div
        key={i}
        className="bg-card border-border tablet:gap-4 tablet:p-8 flex h-full flex-col gap-2 rounded-3xl border p-5"
      >
        <div className="bg-foreground/10 h-5 w-32 animate-pulse rounded" />
        <div className="bg-foreground/10 h-3.5 w-full max-w-56 animate-pulse rounded" />
        <div className="bg-foreground/10 h-3.5 w-3/4 animate-pulse rounded" />
      </div>
    ))}
  </div>
);

export const RolePageSkeleton = () => (
  <div className="tablet:p-10 flex w-full max-w-130 flex-1 flex-col justify-center p-4">
    <div className="flex flex-col items-center gap-2.5 text-center">
      <div className="bg-foreground/10 h-3 w-24 animate-pulse rounded" />
      <div className="bg-foreground/10 h-9 w-72 max-w-full animate-pulse rounded" />
    </div>
    <RolePageCardsSkeleton />
  </div>
);
