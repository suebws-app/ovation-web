import type { FilterChipItem } from "@/components/FilterChipRail";

export type PhotoTileMock = {
  id: number;
  tint: string;
  monogram: string;
  name: string;
  height: number;
  favourite: boolean;
  hasAudio: boolean;
  audioLen: string;
  time: string;
};

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

const FAVOURITE_INDEXES = new Set([0, 4, 9, 15, 21]);
const AUDIO_INDEXES = new Set([1, 3, 6, 12, 18, 24]);

export const PHOTO_TILES: PhotoTileMock[] = Array.from(
  { length: 28 },
  (_, i) => ({
    id: i,
    tint: TINTS[i % TINTS.length],
    monogram: MONOGRAMS[i % MONOGRAMS.length],
    name: NAMES[i % NAMES.length],
    height: HEIGHTS[i % HEIGHTS.length],
    favourite: FAVOURITE_INDEXES.has(i),
    hasAudio: AUDIO_INDEXES.has(i),
    audioLen: AUDIO_TIMES[i % AUDIO_TIMES.length],
    time: `${String(19 + (i % 6)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
  }),
);

export const PHOTO_RECEPTION_COUNT = 20;

export const PHOTO_DETAIL_WAVE = [
  0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 0.3, 0.8, 0.5, 0.7, 0.4, 0.9, 0.6, 0.3, 0.8,
  0.5, 0.7, 1, 0.4, 0.6, 0.9, 0.3, 0.7, 0.5, 0.8, 0.4, 0.6, 0.9, 0.3, 0.7, 0.5,
];

export const PHOTO_ALBUM_CHIPS: FilterChipItem[] = [
  { label: "All", count: 64 },
  { label: "\u2665 Favourites", count: 12 },
  { label: "With audio", count: 42 },
  { label: "Family", count: 21 },
  { label: "Reception", count: 23 },
];
