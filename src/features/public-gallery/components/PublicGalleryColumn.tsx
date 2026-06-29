import { heightFor } from "@/features/photos/adapters";
import type { GalleryItem } from "@/lib/api/types";
import { PublicGalleryTile } from "./PublicGalleryTile";

type PublicGalleryColumnProps = {
  cells: { item: GalleryItem; index: number }[];
  onOpen: (index: number) => void;
};

export const PublicGalleryColumn = ({
  cells,
  onOpen,
}: PublicGalleryColumnProps) => (
  <div className="flex flex-1 flex-col gap-3">
    {cells.map(({ item, index }) => (
      <PublicGalleryTile
        key={item.id}
        item={item}
        height={heightFor(index)}
        onOpen={() => onOpen(index)}
      />
    ))}
  </div>
);
