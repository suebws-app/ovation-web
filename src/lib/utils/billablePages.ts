export const getBillablePages = (totalPages: number): number =>
  totalPages % 2 === 0 ? totalPages : totalPages + 1;

/**
 * Total pages Peecho renders + bills, mirroring the backend PDF planner
 * (`payments.service.ts::computeBookPageCount`): cover-front + intro + photo
 * pages (layflat spans two pages per photo) + a blank filler when the running
 * count is odd + outro + cover-back. The book customizer has no message pages.
 */
export const computeRenderedBookPages = (
  photoCount: number,
  isLayflat: boolean,
): number => {
  const photoPages = isLayflat ? photoCount * 2 : photoCount;
  const content = 2 + photoPages;
  const even = content % 2 === 0 ? content : content + 1;
  return even + 2;
};
