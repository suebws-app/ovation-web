import type { KeepsakeFilter } from "./components/FilterTabs";

const FILTER_BY_PRODUCT_TYPE: Record<string, Exclude<KeepsakeFilter, "all">[]> =
  {
    hardcover: ["printed", "physical"],
    softcover: ["printed", "physical"],
    layflat: ["printed", "physical"],
    audio_vinyl: ["physical"],
    video_montage: ["digital"],
    digital_album: ["digital"],
    thank_you_cards: ["printed", "physical", "gifts"],
    canvas_print: ["printed", "physical", "gifts"],
  };

export const matchesFilter = (
  productType: string,
  filter: KeepsakeFilter,
): boolean => {
  if (filter === "all") return true;
  const list = FILTER_BY_PRODUCT_TYPE[productType] ?? [];
  return list.includes(filter);
};
