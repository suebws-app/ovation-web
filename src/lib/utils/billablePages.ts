export const getBillablePages = (totalPages: number): number =>
  totalPages % 2 === 0 ? totalPages : totalPages + 1;

export type InteriorDensity = "spacious" | "balanced" | "compact";

// How many photos each layout unit consumes per density. MUST match the backend
// (ovation-api photo-layouts.ts `PATTERNS`).
const DENSITY_PATTERNS: Record<InteriorDensity, number[]> = {
  spacious: [1],
  balanced: [1, 2],
  compact: [3, 4, 2, 3],
};

/**
 * Interior page count for a photo count at a density. Non-layflat = one page per
 * unit; layflat = two pages (left+right) per spread unit. MUST match the backend
 * (`photo-layouts.ts::countInteriorPages`).
 */
export const countInteriorPages = (
  photoCount: number,
  density: InteriorDensity,
  isLayflat: boolean,
): number => {
  const pattern = DENSITY_PATTERNS[density];
  let units = 0;
  let i = 0;
  while (i < photoCount) {
    i += Math.min(pattern[units % pattern.length], photoCount - i);
    units += 1;
  }
  return isLayflat ? units * 2 : units;
};

/**
 * Total pages Peecho renders + bills, mirroring the backend PDF planner
 * (`payments.service.ts::computeBookPageCount`): cover-front + intro + photo
 * pages + a blank filler when the running count is odd + outro + cover-back.
 * The book customizer has no message pages.
 */
export const computeRenderedBookPages = (
  photoCount: number,
  isLayflat: boolean,
  density: InteriorDensity = "spacious",
): number => {
  const photoPages = countInteriorPages(photoCount, density, isLayflat);
  const content = 2 + photoPages;
  const even = content % 2 === 0 ? content : content + 1;
  return even + 2;
};
