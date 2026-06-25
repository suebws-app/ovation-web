import { cn } from "@ovation/ui/utils/cn";

const FEATURES = [0, 1, 2, 3];

type PlanCardSkeletonProps = {
  highlighted?: boolean;
};

export const PlanCardSkeleton = ({
  highlighted = false,
}: PlanCardSkeletonProps) => (
  <div
    className={cn(
      "rounded-20 relative flex h-full flex-col p-7",
      highlighted
        ? "border-primary bg-card shadow-primary/20 scale-[1.02] border-2 shadow-lg"
        : "border-border bg-background border",
    )}
  >
    <div className="bg-foreground/10 h-6 w-32 animate-pulse rounded" />
    <div className="mt-2.5 flex items-baseline gap-1.5">
      <div className="bg-foreground/10 h-8 w-24 animate-pulse rounded" />
      <div className="bg-foreground/10 h-3 w-12 animate-pulse rounded" />
    </div>
    <div className="bg-foreground/10 mt-1 h-3 w-40 animate-pulse rounded" />
    <div className="mt-2.5 flex min-h-10.5 flex-col gap-1.5">
      <div className="bg-foreground/10 h-3.5 w-full animate-pulse rounded" />
      <div className="bg-foreground/10 h-3.5 w-3/4 animate-pulse rounded" />
    </div>
    <div className="bg-border my-4.5 h-px" />
    <div className="flex flex-1 flex-col gap-2.5">
      {FEATURES.map((j) => (
        <div key={j} className="flex items-start gap-2">
          <div className="bg-foreground/10 mt-0.5 size-3.5 shrink-0 animate-pulse rounded" />
          <div className="bg-foreground/10 h-3.5 w-full max-w-56 animate-pulse rounded" />
        </div>
      ))}
    </div>
    <div className="bg-primary/30 mt-6 h-10 w-full animate-pulse rounded-full" />
  </div>
);
