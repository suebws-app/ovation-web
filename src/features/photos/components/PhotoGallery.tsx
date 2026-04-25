"use client";

import { PHOTO_RECEPTION_COUNT, PHOTO_TILES } from "../mocks";
import { PhotoSectionHeader } from "./PhotoSectionHeader";
import { PhotoTile } from "./PhotoTile";

type PhotoGalleryProps = {
  selectMode: boolean;
  selectedIds: Set<number>;
  onTileClick: (id: number) => void;
};

export const PhotoGallery = ({
  selectMode,
  selectedIds,
  onTileClick,
}: PhotoGalleryProps) => {
  const reception = PHOTO_TILES.slice(0, PHOTO_RECEPTION_COUNT);
  const party = PHOTO_TILES.slice(PHOTO_RECEPTION_COUNT);

  return (
    <div className="tablet:p-6 flex-1 overflow-auto p-4">
      <PhotoSectionHeader
        title="Reception"
        meta={`14 Jun \u00b7 19:00 \u2192 22:00 \u00b7 ${reception.length} photos`}
      />
      <div className="tablet:columns-3 large-desktop:columns-4 columns-2 gap-3">
        {reception.map((tile) => (
          <PhotoTile
            key={tile.id}
            tile={tile}
            selected={selectedIds.has(tile.id)}
            showSelect={selectMode}
            onClick={() => onTileClick(tile.id)}
          />
        ))}
      </div>

      <PhotoSectionHeader
        title="Party"
        meta={`14 Jun \u00b7 22:00 \u2192 02:00 \u00b7 ${party.length} photos`}
      />
      <div className="tablet:columns-3 large-desktop:columns-4 columns-2 gap-3">
        {party.map((tile) => (
          <PhotoTile
            key={tile.id}
            tile={tile}
            selected={selectedIds.has(tile.id)}
            showSelect={selectMode}
            onClick={() => onTileClick(tile.id)}
          />
        ))}
      </div>
    </div>
  );
};
