import { Skeleton } from "@ovation/ui/components/Skeleton";

export const SeoDashboardSkeleton = () => (
  <section className="section-container-small">
    <header className="mb-8 flex flex-col gap-2">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-72" />
    </header>
    <div className="tablet:grid-cols-3 grid grid-cols-1 gap-6">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="rounded-16 h-28 w-full" />
      ))}
    </div>
  </section>
);
