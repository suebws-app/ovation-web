export const BlogSkeletonCard = () => (
  <div className="border-border rounded-16 flex h-full flex-col overflow-hidden border">
    <div className="bg-muted-foreground/15 aspect-video w-full animate-pulse" />
    <div className="flex flex-1 flex-col gap-3 p-6">
      <div className="bg-muted-foreground/15 h-3 w-20 animate-pulse rounded" />
      <div className="bg-muted-foreground/15 h-6 w-11/12 animate-pulse rounded" />
      <div className="bg-muted-foreground/15 h-6 w-3/5 animate-pulse rounded" />
      <div className="mt-2 flex flex-col gap-2">
        <div className="bg-muted-foreground/15 h-3.5 w-full animate-pulse rounded" />
        <div className="bg-muted-foreground/15 h-3.5 w-full animate-pulse rounded" />
        <div className="bg-muted-foreground/15 h-3.5 w-4/5 animate-pulse rounded" />
      </div>
      <div className="bg-muted-foreground/15 mt-auto h-3 w-32 animate-pulse rounded pt-2" />
    </div>
  </div>
);
