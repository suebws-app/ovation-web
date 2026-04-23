"use client";

import { useState, useCallback } from "react";
import { Button } from "@ovation/ui/components/Button";
import { Chip } from "@ovation/ui/components/Chip";
import { PhotoToolbar } from "./components/PhotoToolbar";
import { BatchBar } from "./components/BatchBar";

import { DetailPane } from "./components/DetailPane";
import { PhotoTile } from "./components/PhotoTile";

const TINTS = [
  "#EFC9A8",
  "#D8C9B2",
  "#B9C9D9",
  "#C8B5D9",
  "#F2D7B3",
  "#B8D3B6",
  "#E9BFC4",
  "#ADC4D1",
  "#EAD0BB",
  "#C3D8E6",
  "#D4BFE0",
  "#F0C9A0",
];
const HEIGHTS = [260, 200, 300, 240, 220, 280, 340, 200];
const NAMES = [
  "Margot",
  "Joan",
  "Angela",
  "Elise",
  "Carlos",
  "Marco",
  "Nadia",
  "Finn",
  "Ella",
  "Pavel",
];
const MONOGRAMS = ["M", "J", "A", "E", "C", "MB", "N", "F", "EL", "P"];
const AUDIO_TIMES = ["0:42", "1:12", "0:58", "2:03", "1:28", "0:34"];

const INITIAL_TILES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  tint: TINTS[i % TINTS.length],
  monogram: MONOGRAMS[i % MONOGRAMS.length],
  name: NAMES[i % NAMES.length],
  height: HEIGHTS[i % HEIGHTS.length],
  favourite: [0, 4, 9, 15, 21].includes(i),
  hasAudio: [1, 3, 6, 12, 18, 24].includes(i),
  audioLen: AUDIO_TIMES[i % 6],
  time: `${String(19 + (i % 6)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
}));

const DETAIL_WAVE = [
  0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 0.3, 0.8, 0.5, 0.7, 0.4, 0.9, 0.6, 0.3, 0.8,
  0.5, 0.7, 1, 0.4, 0.6, 0.9, 0.3, 0.7, 0.5, 0.8, 0.4, 0.6, 0.9, 0.3, 0.7, 0.5,
];

const ALBUM_CHIPS = [
  { label: "All", count: 64 },
  { label: "\u2665 Favourites", count: 12 },
  { label: "With audio", count: 42 },
  { label: "Family", count: 21 },
  { label: "Reception", count: 23 },
];

export const PhotosPage = () => {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeAlbum, setActiveAlbum] = useState("All");
  const [activePhotoId, setActivePhotoId] = useState<number>(0);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectModeToggle = () => {
    if (selectMode) {
      setSelectedIds(new Set());
    }
    setSelectMode(!selectMode);
  };

  const activePhoto =
    INITIAL_TILES.find((t) => t.id === activePhotoId) ?? INITIAL_TILES[0];

  const handleTileClick = useCallback(
    (id: number) => {
      if (selectMode) {
        toggleSelect(id);
      } else {
        setActivePhotoId(id);
      }
    },
    [selectMode, toggleSelect],
  );

  return (
    <div className="-mx-4 -mb-6 tablet:-mb-10 desktop:-mb-20 grid min-h-screen large-desktop:grid-cols-[1fr_340px]">
      <div className="flex min-w-0 flex-col bg-card">
        <PhotoToolbar />

        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 tablet:px-7">
          <Button
            variant={selectMode ? "default" : "outline"}
            size="sm"
            onClick={handleSelectModeToggle}
            className="rounded-full"
          >
            {selectMode ? `Cancel (${selectedIds.size})` : "Select"}
          </Button>
          {selectMode && selectedIds.size > 0 && (
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="cursor-pointer type-caption font-semibold text-primary"
            >
              Clear all
            </button>
          )}
        </div>

        {selectMode && <BatchBar count={selectedIds.size} total={64} />}

        <div className="flex gap-2 overflow-auto border-b border-border bg-card px-4 py-3 large-desktop:hidden">
          {ALBUM_CHIPS.map((c) => (
            <Chip
              key={c.label}
              label={c.label}
              count={c.count}
              active={activeAlbum === c.label}
              onClick={() => setActiveAlbum(c.label)}
            />
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4 tablet:p-6">
          <SectionHeader
            title="Reception"
            meta="14 Jun \u00b7 19:00 \u2192 22:00 \u00b7 23 photos"
          />
          <div className="columns-2 gap-3 tablet:columns-3 large-desktop:columns-4">
            {INITIAL_TILES.slice(0, 20).map((t) => (
              <PhotoTile
                key={t.id}
                {...t}
                selected={selectedIds.has(t.id)}
                showSelect={selectMode}
                onClick={() => handleTileClick(t.id)}
              />
            ))}
          </div>

          <SectionHeader
            title="Party"
            meta="14 Jun \u00b7 22:00 \u2192 02:00 \u00b7 10 photos"
          />
          <div className="columns-2 gap-3 tablet:columns-3 large-desktop:columns-4">
            {INITIAL_TILES.slice(20).map((t) => (
              <PhotoTile
                key={t.id}
                {...t}
                selected={selectedIds.has(t.id)}
                showSelect={selectMode}
                onClick={() => handleTileClick(t.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <DetailPane
        monogram={activePhoto.monogram}
        tint={activePhoto.tint}
        name={`${activePhoto.name} ${activePhoto.monogram === "MB" ? "Benedetti" : ""}`}
        relation={activePhoto.hasAudio ? "Guest \u00b7 with audio" : "Guest"}
        quote="The way you look at her \u2014 like the room just got quieter."
        wave={DETAIL_WAVE}
      />
    </div>
  );
};

const SectionHeader = ({ title, meta }: { title: string; meta: string }) => (
  <div className="mb-3 mt-4 flex items-center gap-2.5 first:mt-0">
    <span className="font-serif type-body font-semibold">{title}</span>
    <span className="type-caption text-muted-foreground">&middot; {meta}</span>
  </div>
);
