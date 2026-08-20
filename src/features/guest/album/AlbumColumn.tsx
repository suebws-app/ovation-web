"use client";

import { heightFor } from "@/features/photos/adapters";
import type { GalleryItem } from "@/lib/api/types";
import { AlbumTile } from "./AlbumTile";

type AlbumColumnProps = {
  cells: { item: GalleryItem; index: number }[];
  onOpen: (index: number) => void;
  onLike: (item: GalleryItem) => void;
  onComment: (item: GalleryItem) => void;
};

export const AlbumColumn = ({
  cells,
  onOpen,
  onLike,
  onComment,
}: AlbumColumnProps) => (
  <div className="flex flex-1 flex-col gap-3">
    {cells.map(({ item, index }) => (
      <AlbumTile
        key={item.id}
        item={item}
        height={heightFor(index)}
        onOpen={() => onOpen(index)}
        onLike={() => onLike(item)}
        onComment={() => onComment(item)}
      />
    ))}
  </div>
);
