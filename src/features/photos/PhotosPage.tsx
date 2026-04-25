"use client";

import { useState } from "react";

import { FilterChipRail } from "@/components/FilterChipRail";
import { SelectionToolbar } from "@/components/SelectionToolbar";
import { useSelectionMode } from "@/lib/hooks/useSelectionMode";

import { BatchBar } from "./components/BatchBar";
import { DetailPane } from "./components/DetailPane";
import { PhotoGallery } from "./components/PhotoGallery";
import { PhotoToolbar } from "./components/PhotoToolbar";
import {
  PHOTO_ALBUM_CHIPS,
  PHOTO_DETAIL_WAVE,
  PHOTO_TILES,
} from "./mocks";

const TOTAL_PHOTOS = 64;

export const PhotosPage = () => {
  const selection = useSelectionMode<number>();
  const [activeAlbum, setActiveAlbum] = useState("All");
  const [activePhotoId, setActivePhotoId] = useState(0);

  const handleTileClick = (id: number) => {
    if (selection.selectMode) {
      selection.toggleSelect(id);
    } else {
      setActivePhotoId(id);
    }
  };

  const activePhoto =
    PHOTO_TILES.find((t) => t.id === activePhotoId) ?? PHOTO_TILES[0];

  return (
    <div className="-mx-4 -mb-6 grid min-h-screen tablet:-mb-10 desktop:-mb-20 large-desktop:grid-cols-[1fr_340px]">
      <div className="flex min-w-0 flex-col bg-card">
        <PhotoToolbar />
        <SelectionToolbar
          selectMode={selection.selectMode}
          count={selection.selectedIds.size}
          onToggle={selection.toggleSelectMode}
          onClearAll={selection.clear}
        />
        {selection.selectMode && (
          <BatchBar count={selection.selectedIds.size} total={TOTAL_PHOTOS} />
        )}
        <FilterChipRail
          chips={PHOTO_ALBUM_CHIPS}
          activeLabel={activeAlbum}
          onSelect={setActiveAlbum}
          className="large-desktop:hidden"
        />
        <PhotoGallery
          selectMode={selection.selectMode}
          selectedIds={selection.selectedIds}
          onTileClick={handleTileClick}
        />
      </div>
      <DetailPane
        monogram={activePhoto.monogram}
        tint={activePhoto.tint}
        name={`${activePhoto.name} ${activePhoto.monogram === "MB" ? "Benedetti" : ""}`}
        relation={activePhoto.hasAudio ? "Guest \u00b7 with audio" : "Guest"}
        quote="The way you look at her \u2014 like the room just got quieter."
        wave={PHOTO_DETAIL_WAVE}
      />
    </div>
  );
};
