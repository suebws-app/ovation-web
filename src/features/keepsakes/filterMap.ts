import type { KeepsakeFilter } from "./components/FilterTabs";

const FILTER_BY_SKU: Record<string, Exclude<KeepsakeFilter, "all">[]> = {
  hardcover: ["printed", "physical"],
  softcover: ["printed", "physical"],
  layflat: ["printed", "physical"],
};

export const matchesFilter = (sku: string, filter: KeepsakeFilter): boolean => {
  if (filter === "all") return true;
  const list = FILTER_BY_SKU[sku] ?? [];
  return list.includes(filter);
};
