"use client";

import { useEffect, useMemo, useState } from "react";
import { heightFor } from "@/features/photos/adapters";
import type { GalleryItem } from "@/lib/api/types";
import { PublicGalleryColumn } from "./PublicGalleryColumn";

type PublicGalleryGridProps = {
  items: GalleryItem[];
  onOpen: (index: number) => void;
};

const TILE_GAP = 12;

const useColumnCount = (): number => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const large = window.matchMedia("(min-width: 1800px)");
    const tablet = window.matchMedia("(min-width: 740px)");
    const compute = () => {
      if (large.matches) setCount(4);
      else if (tablet.matches) setCount(3);
      else setCount(2);
    };
    compute();
    large.addEventListener("change", compute);
    tablet.addEventListener("change", compute);
    return () => {
      large.removeEventListener("change", compute);
      tablet.removeEventListener("change", compute);
    };
  }, []);

  return count;
};

export const PublicGalleryGrid = ({
  items,
  onOpen,
}: PublicGalleryGridProps) => {
  const columnCount = useColumnCount();

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
    <div className="flex gap-3">
      {columns.map((col, colIdx) => (
        <PublicGalleryColumn key={colIdx} cells={col} onOpen={onOpen} />
      ))}
    </div>
  );
};
