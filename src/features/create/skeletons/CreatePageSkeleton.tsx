export const CreatePageBodySkeleton = () => (
  <>
    <div className="tablet:mt-7 tablet:grid-cols-[1fr_auto_1fr] mt-4 grid grid-cols-1 items-end gap-3.5">
      <div className="flex flex-col gap-2">
        <div className="bg-foreground/10 h-3.5 w-20 animate-pulse rounded" />
        <div className="bg-foreground/10 rounded-8 h-10 w-full animate-pulse" />
      </div>
      <div className="bg-foreground/10 tablet:block hidden h-6 w-6 animate-pulse self-end rounded" />
      <div className="flex flex-col gap-2">
        <div className="bg-foreground/10 h-3.5 w-20 animate-pulse rounded" />
        <div className="bg-foreground/10 rounded-8 h-10 w-full animate-pulse" />
      </div>
    </div>

    <div className="tablet:mt-6 mt-3 flex flex-col gap-2">
      <div className="bg-foreground/10 h-3.5 w-40 animate-pulse rounded" />
      <div className="bg-foreground/10 rounded-8 h-10 w-full animate-pulse" />
    </div>

    <div className="tablet:grid-cols-2 mt-4 grid grid-cols-1 gap-3.5">
      <div className="flex flex-col gap-2">
        <div className="bg-foreground/10 h-3.5 w-24 animate-pulse rounded" />
        <div className="bg-foreground/10 rounded-8 h-10 w-full animate-pulse" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-foreground/10 h-3.5 w-24 animate-pulse rounded" />
        <div className="bg-foreground/10 rounded-8 h-10 w-full animate-pulse" />
      </div>
    </div>

    <div className="bg-primary/30 mt-6 h-12 w-full animate-pulse rounded-full" />
  </>
);

export const CreatePageSkeleton = () => (
  <div className="desktop:grid desktop:grid-cols-[40%_1fr] desktop:min-h-[calc(100vh-89px)] desktop:h-auto desktop:overflow-visible grid h-[calc(100svh-89px)] overflow-hidden">
    <div className="from-primary to-primary/80 text-primary-foreground desktop:flex desktop:items-center desktop:justify-center relative hidden overflow-hidden bg-linear-to-br">
      <div className="dark:bg-background/90 pointer-events-none absolute inset-0" />
      <div className="relative flex w-full max-w-110 flex-col gap-10 p-16">
        <div className="bg-foreground/15 h-3 w-32 animate-pulse rounded" />
        <div className="bg-foreground/10 aspect-[3/4] w-full max-w-72 animate-pulse rounded-2xl" />
        <div className="flex flex-col gap-2">
          <div className="bg-foreground/10 h-3 w-full max-w-72 animate-pulse rounded" />
          <div className="bg-foreground/10 h-3 w-full max-w-56 animate-pulse rounded" />
        </div>
        <div className="bg-foreground/10 h-16 w-full max-w-72 animate-pulse rounded-xl" />
      </div>
    </div>

    <div className="tablet:px-18 tablet:pt-10 tablet:pb-12 desktop:justify-start flex h-full items-start justify-center overflow-y-auto px-5 pt-5 pb-5">
      <div className="mx-auto my-auto w-full max-w-130">
        <div className="bg-foreground/10 mb-3 h-3 w-24 animate-pulse rounded" />
        <div className="flex flex-col gap-2">
          <div className="bg-foreground/10 h-10 w-full max-w-96 animate-pulse rounded" />
          <div className="bg-foreground/10 h-10 w-3/4 animate-pulse rounded" />
        </div>
        <div className="bg-foreground/10 mt-3 h-4 w-full max-w-80 animate-pulse rounded" />
        <CreatePageBodySkeleton />
      </div>
    </div>
  </div>
);
