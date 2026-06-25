import { PlanCardSkeleton } from "./PlanCardSkeleton";

const CARDS = [{ highlighted: true }, { highlighted: false }];

export const PlansCardsSkeleton = () => (
  <div className="tablet:grid-cols-2 grid items-stretch gap-4.5">
    {CARDS.map((card, i) => (
      <PlanCardSkeleton key={i} highlighted={card.highlighted} />
    ))}
  </div>
);

export const PlansSkeleton = () => (
  <div className="bg-background min-h-[calc(100vh-89px)]">
    <div className="mx-auto max-w-310 px-6 py-14">
      <div className="mb-10 text-center">
        <div className="bg-foreground/10 mx-auto h-4 w-32 animate-pulse rounded" />
        <div className="mt-3.5 flex flex-col items-center">
          <div className="bg-foreground/10 tablet:h-12 h-10 w-96 max-w-full animate-pulse rounded" />
          <div className="bg-foreground/10 tablet:h-12 mt-1 h-10 w-72 max-w-full animate-pulse rounded" />
        </div>
        <div className="mt-5 flex justify-center">
          <div className="bg-foreground/10 h-8 w-20 animate-pulse rounded-lg" />
        </div>
      </div>
      <PlansCardsSkeleton />
    </div>
  </div>
);
