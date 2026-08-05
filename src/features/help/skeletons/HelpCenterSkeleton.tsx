import { Skeleton } from "@ovation/ui/components/Skeleton";
import { containerClassName } from "@/lib/utils/layoutClassNames";

const FAQ_ROWS = Array.from({ length: 7 }, (_, i) => i);

export const HelpCenterSkeleton = () => (
  <div className={containerClassName}>
    <div className="rounded-20 bg-card tablet:p-12 desktop:p-14 desktop:py-16 relative mb-10 overflow-hidden p-8 py-10">
      <div className="bg-primary/10 pointer-events-none absolute -top-20 -right-20 size-80 rounded-full" />
      <div className="bg-secondary/10 pointer-events-none absolute -bottom-24 -left-16 size-60 rounded-full" />
      <div className="relative flex max-w-2xl flex-col gap-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-96 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-4/5 max-w-lg" />
      </div>
    </div>
    <div>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-1.5 h-4 w-96 max-w-full" />
      <div className="mt-3.5 flex flex-col gap-2.5">
        {FAQ_ROWS.map((i) => (
          <Skeleton key={i} className="rounded-16 h-14 w-full" />
        ))}
      </div>
    </div>
    <div className="rounded-20 bg-foreground/5 tablet:p-8 relative flex flex-col gap-3 p-6">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-6 w-64" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-4 w-2/3 max-w-md" />
      <Skeleton className="mt-2 h-10 w-56 rounded-full" />
    </div>
  </div>
);
