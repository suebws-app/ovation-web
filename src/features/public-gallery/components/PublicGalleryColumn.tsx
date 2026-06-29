import { heightFor } from "@/features/photos/adapters";
import type { GalleryItem } from "@/lib/api/types";
import { PublicGalleryTile } from "./PublicGalleryTile";

type PublicGalleryColumnProps = {
  cells: { item: GalleryItem; index: number }[];
  slug: string;
  code: string;
  onOpen: (index: number) => void;
};

export const PublicGalleryColumn = ({
  cells,
  slug,
  code,
  onOpen,
}: PublicGalleryColumnProps) => (
  <div className="flex flex-1 flex-col gap-3">
    {cells.map(({ item, index }) => (
      <PublicGalleryTile
        key={item.id}
        item={item}
        height={heightFor(index)}
        slug={slug}
        code={code}
        onOpen={() => onOpen(index)}
      />
    ))}
  </div>
);
