"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { heightFor } from "@/features/photos/adapters";
import type { GalleryItem } from "@/lib/api/types";
import { AlbumColumn } from "./AlbumColumn";

type AlbumGridProps = {
  items: GalleryItem[];
  onOpen: (index: number) => void;
  onLike: (item: GalleryItem) => void;
  onComment: (item: GalleryItem) => void;
  onDelete?: (item: GalleryItem) => void;
};

const TILE_GAP = 12;

const TARGET_COLUMN_WIDTH = 260;
const MIN_COLUMN_COUNT = 2;

const useColumnCount = (
  ref: React.RefObject<HTMLDivElement | null>,
): number => {
  const [count, setCount] = useState(MIN_COLUMN_COUNT);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const compute = () => {
      const width = node.clientWidth;
      if (width === 0) return;
      const fitted = Math.floor(
        (width + TILE_GAP) / (TARGET_COLUMN_WIDTH + TILE_GAP),
      );
      startTransition(() => setCount(Math.max(MIN_COLUMN_COUNT, fitted)));
    };
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return count;
};

export const AlbumGrid = ({
  items,
  onOpen,
  onLike,
  onComment,
  onDelete,
}: AlbumGridProps) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const columnCount = useColumnCount(gridRef);

  const columns = useMemo(() => {
    const cols: { item: GalleryItem; index: number }[][] = Array.from(
      { length: columnCount },
      () => [],
    );
    const heights = new Array(columnCount).fill(0);
    items.forEach((item, index) => {
      let target = 0;
      for (let i = 1; i < columnCount; i++) {
        if (heights[i] < heights[target]) target = i;
      }
      cols[target]!.push({ item, index });
      heights[target] += heightFor(index) + TILE_GAP;
    });
    return cols;
  }, [items, columnCount]);

  return (
    <div ref={gridRef} className="flex gap-3">
      {columns.map((cells, columnIndex) => (
        <AlbumColumn
          key={columnIndex}
          cells={cells}
          onOpen={onOpen}
          onLike={onLike}
          onComment={onComment}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
