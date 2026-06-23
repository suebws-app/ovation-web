import { Skeleton } from "@ovation/ui/components/Skeleton";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { PhotoGallerySkeleton } from "./PhotoGallerySkeleton";

const chips = Array.from({ length: 3 }, (_, i) => i);

const SkeletonChip = () => (
  <Skeleton className="h-8 w-24 shrink-0 rounded-full border" />
);

export const PhotosSkeleton = () => (
  <div className={containerClassName}>
    <div className="flex min-h-fit items-center gap-2 overflow-hidden">
      <Skeleton className="mr-1 ml-2.5 size-4 shrink-0" />
      {chips.map((i) => (
        <SkeletonChip key={i} />
      ))}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Skeleton className="size-9 rounded-full border" />
        <Skeleton className="h-9 w-28 rounded-full border" />
      </div>
    </div>
    <PhotoGallerySkeleton />
  </div>
);
