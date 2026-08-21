export const getBillablePages = (totalPages: number): number =>
  totalPages % 2 === 0 ? totalPages : totalPages + 1;

export type InteriorDensity = "spacious" | "balanced" | "asymmetrical";

// How many photos each layout unit consumes per density. MUST match the backend
// (ovation-api photo-layouts.ts `PATTERNS` / `patternFor`). Asymmetrical uses a
// different pattern on layflat, where a unit is the double-page spread canvas.
const DENSITY_PATTERNS: Record<InteriorDensity, number[]> = {
  spacious: [1],
  balanced: [1, 2],
  asymmetrical: [4, 3, 5, 2],
};

const ASYM_SPREAD_PATTERN = [3, 2, 4, 5];

// Layflat balanced packs an even 1-2 photos per page (2-4 per spread). MUST
// match the backend (photo-layouts.ts `BALANCED_SPREAD_PATTERN`).
const BALANCED_SPREAD_PATTERN = [4, 3, 2];

const patternFor = (density: InteriorDensity, isLayflat: boolean): number[] => {
  if (isLayflat && density === "asymmetrical") return ASYM_SPREAD_PATTERN;
  if (isLayflat && density === "balanced") return BALANCED_SPREAD_PATTERN;
  return DENSITY_PATTERNS[density];
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
  const pattern = patternFor(density, isLayflat);
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

// Loop backstop so a bad min/max never spins forever.
const PHOTO_DELTA_CAP = 10000;

/**
 * How many MORE photos are needed so the rendered book reaches `minPages`,
 * accounting for densities that pack several photos per page. Returns 0 if the
 * current photo count already renders enough pages.
 */
export const photosNeededForMinPages = (
  currentPhotos: number,
  minPages: number,
  isLayflat: boolean,
  density: InteriorDensity,
): number => {
  let extra = 0;
  while (
    extra < PHOTO_DELTA_CAP &&
    computeRenderedBookPages(currentPhotos + extra, isLayflat, density) <
      minPages
  ) {
    extra += 1;
  }
  return extra;
};

/**
 * How many photos must be REMOVED so the rendered book fits within `maxPages`.
 * Returns 0 if it already fits (never returns more than `currentPhotos`).
 */
export const photosOverMaxPages = (
  currentPhotos: number,
  maxPages: number,
  isLayflat: boolean,
  density: InteriorDensity,
): number => {
  let remove = 0;
  while (
    remove < currentPhotos &&
    computeRenderedBookPages(currentPhotos - remove, isLayflat, density) >
      maxPages
  ) {
    remove += 1;
  }
  return remove;
};
