"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { heightFor, type PhotoView } from "../adapters";
import { PhotoTile } from "./PhotoTile";

type PhotoGalleryProps = {
  photos: PhotoView[];
  isSelected: (id: string) => boolean;
  onTileClick: (id: string) => void;
  onToggleSelect: (id: string) => void;
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

export const PhotoGallery = ({
  photos,
  isSelected,
  onTileClick,
  onToggleSelect,
}: PhotoGalleryProps) => {
  const t = useTranslations();
  const columnCount = useColumnCount();

  const columns = useMemo(() => {
    const cols: { tile: PhotoView; index: number }[][] = Array.from(
      { length: columnCount },
      () => [],
    );
    const heights = new Array(columnCount).fill(0);
    photos.forEach((tile, index) => {
      let target = 0;
      for (let i = 1; i < columnCount; i++) {
        if (heights[i] < heights[target]) target = i;
      }
      cols[target]!.push({ tile, index });
      heights[target] += heightFor(index) + TILE_GAP;
    });
    return cols;
  }, [photos, columnCount]);

  if (photos.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
        <p className="type-h2 font-semibold">{t("photos__empty_title")}</p>
        <p className="type-body-small text-muted-foreground mt-2 max-w-sm">
          {t("photos__empty_body")}
        </p>
      </div>
    );
  }

  return (
    <div className="tablet:px-6 tablet:pb-6 px-4 pb-4">
      <div className="flex gap-3">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-1 flex-col gap-3">
            {col.map(({ tile, index }) => (
              <PhotoTile
                key={tile.id}
                tile={tile}
                height={heightFor(index)}
                index={index}
                selected={isSelected(tile.id)}
                onClick={() => onTileClick(tile.id)}
                onToggleSelect={() => onToggleSelect(tile.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
