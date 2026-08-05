import { Skeleton } from "@ovation/ui/components/Skeleton";
import { containerClassName } from "@/lib/utils/layoutClassNames";

const CHECKLIST_TILES = Array.from({ length: 3 }, (_, i) => i);
const CONFIG_ROWS = Array.from({ length: 4 }, (_, i) => i);

const HeroSkeleton = () => (
  <div className="rounded-20 bg-card tablet:p-8 relative overflow-hidden p-4">
    <div className="bg-primary/10 absolute -top-10 -right-10 size-70 rounded-full" />
    <div className="desktop:grid-cols-[1fr_auto] desktop:gap-10 relative grid items-end gap-6">
      <div className="flex flex-col gap-3.5">
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Skeleton className="rounded-16 desktop:w-64 aspect-video w-full" />
    </div>
  </div>
);

const ChecklistSkeleton = () => (
  <div>
    <div className="mb-3.5 flex items-baseline justify-between">
      <Skeleton className="h-7 w-52" />
      <Skeleton className="h-3 w-24" />
    </div>
    <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-3">
      {CHECKLIST_TILES.map((i) => (
        <Skeleton key={i} className="rounded-16 h-28 w-full" />
      ))}
    </div>
  </div>
);

const ConfigGridSkeleton = () => (
  <div className="flex flex-col gap-3">
    <Skeleton className="h-7 w-40" />
    <div className="tablet:grid-cols-2 grid grid-cols-1 gap-3">
      {CONFIG_ROWS.map((i) => (
        <Skeleton key={i} className="rounded-16 h-24 w-full" />
      ))}
    </div>
  </div>
);

const PreviewSkeleton = () => (
  <div className="flex flex-col gap-3">
    <Skeleton className="h-7 w-32" />
    <Skeleton className="rounded-16 aspect-video w-full" />
  </div>
);

export const KioskSetupSkeleton = () => (
  <div className={containerClassName}>
    <HeroSkeleton />
    <ChecklistSkeleton />
    <ConfigGridSkeleton />
    <PreviewSkeleton />
  </div>
);
