const COVERS = [0, 1, 2, 3];

export const CoverPageBodySkeleton = () => (
  <>
    <div className="tablet:grid-cols-4 mt-5 grid grid-cols-2 gap-3">
      {COVERS.map((i) => (
        <div
          key={i}
          className="bg-foreground/10 aspect-square w-full animate-pulse rounded-xl"
        />
      ))}
    </div>

    <div className="tablet:mt-6 mt-4">
      <div className="bg-foreground/10 mb-2 h-3 w-32 animate-pulse rounded" />
      <div className="bg-foreground/10 rounded-8 h-11 w-full animate-pulse" />
      <div className="mt-2 flex flex-wrap gap-2">
        <div className="bg-foreground/10 h-7 w-24 animate-pulse rounded-full" />
        <div className="bg-foreground/10 h-7 w-32 animate-pulse rounded-full" />
        <div className="bg-foreground/10 h-7 w-20 animate-pulse rounded-full" />
      </div>
    </div>

    <div className="bg-primary/10 rounded-12 tablet:mt-5 tablet:p-3 mt-2 flex items-start gap-2 p-2.5">
      <div className="bg-foreground/15 size-4 shrink-0 animate-pulse rounded-full" />
      <div className="flex w-full flex-col gap-1.5">
        <div className="bg-foreground/10 h-3 w-full max-w-72 animate-pulse rounded" />
        <div className="bg-foreground/10 h-3 w-1/2 animate-pulse rounded" />
      </div>
    </div>

    <div className="bg-primary/30 tablet:mt-5 mt-3 h-12 w-full animate-pulse rounded-full" />
  </>
);

export const CoverPageSkeleton = () => (
  <div className="desktop:grid-cols-[40%_1fr] desktop:min-h-[calc(100vh-89px)] desktop:h-auto desktop:overflow-visible grid h-[calc(100svh-89px)] overflow-hidden">
    <div className="from-primary to-primary/80 text-primary-foreground desktop:flex desktop:items-center desktop:justify-center relative hidden overflow-hidden bg-linear-to-br">
      <div className="dark:bg-background/90 pointer-events-none absolute inset-0" />
      <div className="relative flex w-full max-w-110 flex-col gap-10 p-16">
        <div className="bg-foreground/15 h-3 w-32 animate-pulse rounded" />
        <div className="bg-foreground/10 aspect-[3/4] w-full max-w-72 animate-pulse rounded-2xl" />
        <div className="flex flex-col gap-2">
          <div className="bg-foreground/10 h-3 w-full max-w-72 animate-pulse rounded" />
          <div className="bg-foreground/10 h-3 w-full max-w-56 animate-pulse rounded" />
        </div>
      </div>
    </div>

    <div className="tablet:px-18 desktop:py-16 desktop:overflow-visible flex h-full min-w-0 items-start justify-center overflow-y-auto px-5 py-3">
      <div className="mx-auto my-auto w-full max-w-130 min-w-0">
        <div className="bg-foreground/10 tablet:mb-3 mb-2 h-3 w-28 animate-pulse rounded" />
        <div className="flex flex-col gap-2">
          <div className="bg-foreground/10 h-10 w-full max-w-96 animate-pulse rounded" />
          <div className="bg-foreground/10 h-10 w-3/4 animate-pulse rounded" />
        </div>
        <div className="bg-foreground/10 tablet:mt-2 mt-1.5 h-4 w-full max-w-80 animate-pulse rounded" />
        <CoverPageBodySkeleton />
      </div>
    </div>
  </div>
);
