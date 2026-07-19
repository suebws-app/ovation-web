export const BlogArticleSkeleton = () => (
  <article className="pb-24">
    <div className="mx-auto max-w-4xl px-6 pt-8">
      <div className="bg-muted-foreground/15 h-3.5 w-32 animate-pulse rounded" />
    </div>

    <header className="tablet:pt-12 mx-auto flex max-w-4xl flex-col gap-6 px-6 pt-8 pb-12">
      <div className="bg-muted-foreground/15 h-3 w-24 animate-pulse rounded" />
      <div className="flex flex-col gap-3">
        <div className="bg-muted-foreground/15 tablet:h-14 h-10 w-11/12 animate-pulse rounded" />
        <div className="bg-muted-foreground/15 tablet:h-14 h-10 w-3/4 animate-pulse rounded" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-muted-foreground/15 h-4 w-full max-w-2xl animate-pulse rounded" />
        <div className="bg-muted-foreground/15 h-4 w-4/5 max-w-xl animate-pulse rounded" />
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-muted-foreground/15 h-3.5 w-24 animate-pulse rounded" />
        <div className="bg-muted-foreground/15 h-3.5 w-20 animate-pulse rounded" />
      </div>
    </header>

    <figure className="mx-auto mb-16 max-w-4xl px-6">
      <div className="bg-muted-foreground/15 rounded-16 aspect-video w-full animate-pulse" />
    </figure>

    <div className="mx-auto max-w-4xl px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="bg-muted-foreground/15 h-4 w-full animate-pulse rounded" />
          <div className="bg-muted-foreground/15 h-4 w-full animate-pulse rounded" />
          <div className="bg-muted-foreground/15 h-4 w-4/5 animate-pulse rounded" />
        </div>
        <div className="bg-muted-foreground/15 h-8 w-2/3 animate-pulse rounded" />
        <div className="flex flex-col gap-3">
          <div className="bg-muted-foreground/15 h-4 w-full animate-pulse rounded" />
          <div className="bg-muted-foreground/15 h-4 w-full animate-pulse rounded" />
          <div className="bg-muted-foreground/15 h-4 w-3/4 animate-pulse rounded" />
          <div className="bg-muted-foreground/15 h-4 w-full animate-pulse rounded" />
        </div>
        <div className="bg-muted-foreground/15 h-8 w-1/2 animate-pulse rounded" />
        <div className="flex flex-col gap-3">
          <div className="bg-muted-foreground/15 h-4 w-full animate-pulse rounded" />
          <div className="bg-muted-foreground/15 h-4 w-11/12 animate-pulse rounded" />
          <div className="bg-muted-foreground/15 h-4 w-full animate-pulse rounded" />
        </div>
      </div>
    </div>
  </article>
);
