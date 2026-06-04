import type { KeepsakeFilter } from "./components/FilterTabs";

const FILTER_BY_SKU: Record<string, Exclude<KeepsakeFilter, "all">[]> = {
  hardcover_book: ["printed", "physical"],
  softcover_book: ["printed", "physical"],
  layflat_book: ["printed", "physical"],
};

export const matchesFilter = (sku: string, filter: KeepsakeFilter): boolean => {
  if (filter === "all") return true;
  const list = FILTER_BY_SKU[sku] ?? [];
  return list.includes(filter);
};
