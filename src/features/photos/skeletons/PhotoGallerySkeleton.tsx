import { Skeleton } from "@ovation/ui/components/Skeleton";
import { cn } from "@ovation/ui/utils/cn";
import { heightFor } from "../adapters";

const COLUMN_TILE_COUNT = 4;
const tiles = Array.from({ length: COLUMN_TILE_COUNT }, (_, i) => i);

const SkeletonTile = ({ height }: { height: number }) => (
  <Skeleton className="rounded-12 w-full shrink-0 border" style={{ height }} />
);

const SkeletonTileColumn = ({
  offset,
  className,
}: {
  offset: number;
  className?: string;
}) => (
  <div className={cn("flex flex-1 flex-col gap-3", className)}>
    {tiles.map((i) => (
      <SkeletonTile
        key={i}
        height={heightFor(offset + i * COLUMN_TILE_COUNT)}
      />
    ))}
  </div>
);

export const PhotoGallerySkeleton = () => (
  <div className="flex gap-3">
    <SkeletonTileColumn offset={0} />
    <SkeletonTileColumn offset={1} />
    <SkeletonTileColumn offset={2} className="tablet:flex hidden" />
    <SkeletonTileColumn offset={3} className="large-desktop:flex hidden" />
  </div>
);
