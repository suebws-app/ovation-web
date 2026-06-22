export const SignUpFormBodySkeleton = () => (
  <>
    <div className="tablet:space-y-4.5 mt-6 space-y-3">
      <div className="flex flex-col gap-2">
        <div className="bg-foreground/10 h-3.5 w-20 animate-pulse rounded" />
        <div className="bg-foreground/10 rounded-8 h-11 w-full animate-pulse" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-foreground/10 h-3.5 w-24 animate-pulse rounded" />
        <div className="bg-foreground/10 rounded-8 h-11 w-full animate-pulse" />
        <div className="bg-foreground/10 mt-1 h-3 w-48 max-w-full animate-pulse rounded" />
      </div>
    </div>

    <div className="mt-3 flex items-start gap-2.5">
      <div className="bg-foreground/15 size-5 shrink-0 animate-pulse rounded-md" />
      <div className="bg-foreground/10 h-4 w-full max-w-80 animate-pulse rounded" />
    </div>

    <div className="bg-foreground/8 mt-6 h-16 w-full animate-pulse rounded" />

    <div className="bg-primary/30 rounded-8 mt-6 h-11 w-full animate-pulse" />

    <div className="tablet:my-6 my-3 flex items-center gap-3">
      <div className="bg-foreground/10 h-px flex-1" />
      <div className="bg-foreground/10 h-3 w-8 animate-pulse rounded" />
      <div className="bg-foreground/10 h-px flex-1" />
    </div>

    <div className="flex gap-2.5">
      <div className="bg-foreground/10 rounded-8 h-11 flex-1 animate-pulse" />
      <div className="bg-foreground/10 rounded-8 h-11 flex-1 animate-pulse" />
    </div>

    <div className="bg-foreground/10 mx-auto mt-6 h-4 w-56 max-w-full animate-pulse rounded" />
  </>
);

export const SignUpFormSkeleton = () => (
  <div className="tablet:p-10 flex w-full max-w-110 flex-1 flex-col justify-center p-4">
    <div className="flex flex-col items-center gap-2.5 text-center">
      <div className="bg-foreground/10 h-3 w-32 animate-pulse rounded" />
      <div className="bg-foreground/10 h-9 w-72 max-w-full animate-pulse rounded" />
      <div className="bg-foreground/10 h-9 w-56 max-w-full animate-pulse rounded" />
    </div>
    <SignUpFormBodySkeleton />
  </div>
);
