export const ELLIPSIS = "…" as const;

export type PageItem = number | typeof ELLIPSIS;

export const buildPages = (current: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: PageItem[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  if (start > 2) pages.push(ELLIPSIS);
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push(ELLIPSIS);
  pages.push(totalPages);
  return pages;
};
