export const VerifyPageBodySkeleton = () => (
  <>
    <div className="mt-9 flex items-center gap-3.5">
      <div className="bg-foreground/10 h-4 w-40 animate-pulse rounded" />
      <div className="bg-foreground/10 h-4 w-24 animate-pulse rounded" />
    </div>

    <div className="bg-foreground/10 mt-11 h-3 w-56 max-w-full animate-pulse rounded" />

    <div className="bg-primary/30 mt-6 h-9 w-40 animate-pulse rounded-full" />
  </>
);

export const VerifyPageSkeleton = () => (
  <div className="tablet:p-10 flex w-full max-w-110 flex-1 flex-col items-center justify-center p-4 text-center">
    <div className="bg-foreground/10 mb-6 size-16 animate-pulse rounded-full" />

    <div className="flex flex-col items-center gap-2.5">
      <div className="bg-foreground/10 h-3 w-32 animate-pulse rounded" />
      <div className="bg-foreground/10 h-9 w-72 max-w-full animate-pulse rounded" />
      <div className="bg-foreground/10 mt-2 h-4 w-80 max-w-full animate-pulse rounded" />
    </div>
    <VerifyPageBodySkeleton />
  </div>
);
