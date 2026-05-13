import type { KeepsakeFilter } from "./components/FilterTabs";

const FILTER_BY_SKU: Record<string, Exclude<KeepsakeFilter, "all">[]> = {
  gold_book: ["printed", "physical"],
  thank_you_cards: ["printed", "physical", "gifts"],
  canvas_print: ["printed", "physical"],
  audio_vinyl: ["physical", "gifts"],
  digital_album: ["digital"],
  video_montage: ["digital"],
};

export const matchesFilter = (sku: string, filter: KeepsakeFilter): boolean => {
  if (filter === "all") return true;
  const list = FILTER_BY_SKU[sku] ?? [];
  return list.includes(filter);
};
