import type { KeepsakeProductVariant } from "@/lib/api/types";

export type Orientation = "portrait" | "landscape" | "square";

export const readNumberAttr = (
  attributes: Record<string, unknown> | undefined,
  key: string,
): number | null => {
  const value = attributes?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
};

export const readStringAttr = (
  attributes: Record<string, unknown> | undefined,
  key: string,
): string | null => {
  const value = attributes?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
};

export const readBoolAttr = (
  attributes: Record<string, unknown> | undefined,
  key: string,
): boolean | null => {
  const value = attributes?.[key];
  return typeof value === "boolean" ? value : null;
};

export const paperTypeOf = (variant: KeepsakeProductVariant): string | null =>
  readStringAttr(variant.attributes, "paperType");

export const sizeKeyOf = (variant: KeepsakeProductVariant): string => {
  const w = readNumberAttr(variant.attributes, "pageWidthMm") ?? 0;
  const h = readNumberAttr(variant.attributes, "pageHeightMm") ?? 0;
  return `${w}x${h}`;
};

export const orientationOf = (variant: KeepsakeProductVariant): Orientation => {
  const w = readNumberAttr(variant.attributes, "pageWidthMm") ?? 0;
  const h = readNumberAttr(variant.attributes, "pageHeightMm") ?? 0;
  if (w === h) return "square";
  return h > w ? "portrait" : "landscape";
};

const SIZE_LABEL_KEY_BY_DIMS: Record<string, string> = {
  "210x297": "keepsakes__book_customizer__size_a4_portrait",
  "297x210": "keepsakes__book_customizer__size_a4_landscape",
  "148x210": "keepsakes__book_customizer__size_a5_portrait",
  "210x148": "keepsakes__book_customizer__size_a5_landscape",
  "210x210": "keepsakes__book_customizer__size_square_210",
  "294x294": "keepsakes__book_customizer__size_square_294",
  "200x200": "keepsakes__book_customizer__size_square_200",
  "216x279": "keepsakes__book_customizer__size_us_letter_portrait",
  "155x235": "keepsakes__book_customizer__size_small_portrait",
  "200x155": "keepsakes__book_customizer__size_small_landscape",
  "193x260": "keepsakes__book_customizer__size_medium_portrait",
  "278x204": "keepsakes__book_customizer__size_hd_a4_landscape",
};

export const sizeLabelKeyFor = (sizeKey: string): string | null =>
  SIZE_LABEL_KEY_BY_DIMS[sizeKey] ?? null;

export const ORIENTATION_LABEL_KEY: Record<Orientation, string> = {
  portrait: "keepsakes__book_customizer__orientation_portrait",
  landscape: "keepsakes__book_customizer__orientation_landscape",
  square: "keepsakes__book_customizer__orientation_square",
};

const PAPER_TYPE_LABEL_KEYS: Record<string, string> = {
  matte: "keepsakes__book_customizer__paper_matte",
  gloss: "keepsakes__book_customizer__paper_gloss",
  uncoated: "keepsakes__book_customizer__paper_uncoated",
  mohawk: "keepsakes__book_customizer__paper_mohawk",
  ephoto: "keepsakes__book_customizer__paper_ephoto",
};

export const paperTypeLabelKeyFor = (paperType: string): string | null =>
  PAPER_TYPE_LABEL_KEYS[paperType.toLowerCase()] ?? null;

export const distinctValues = <T>(
  arr: T[],
  key: (v: T) => string,
): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of arr) {
    const k = key(item);
    if (k && !seen.has(k)) {
      seen.add(k);
      out.push(k);
    }
  }
  return out;
};

export type SizeFacet = {
  sizeKey: string;
  widthMm: number;
  heightMm: number;
  orientation: Orientation;
  labelKey: string | null;
};

export const buildSizeFacets = (
  variants: KeepsakeProductVariant[],
): SizeFacet[] => {
  const map = new Map<string, SizeFacet>();
  for (const variant of variants) {
    const w = readNumberAttr(variant.attributes, "pageWidthMm") ?? 0;
    const h = readNumberAttr(variant.attributes, "pageHeightMm") ?? 0;
    if (w === 0 || h === 0) continue;
    const sizeKey = `${w}x${h}`;
    if (map.has(sizeKey)) continue;
    map.set(sizeKey, {
      sizeKey,
      widthMm: w,
      heightMm: h,
      orientation: orientationOf(variant),
      labelKey: sizeLabelKeyFor(sizeKey),
    });
  }
  return Array.from(map.values());
};

export const buildPaperFacets = (
  variants: KeepsakeProductVariant[],
): string[] => {
  return distinctValues(variants, (v) => paperTypeOf(v) ?? "").filter(
    (value) => value !== "",
  );
};

export const pickVariantForFacets = (
  variants: KeepsakeProductVariant[],
  paperType: string | null,
  sizeKey: string | null,
  photoCount: number,
): {
  matchingVariants: KeepsakeProductVariant[];
  chosenVariant: KeepsakeProductVariant | null;
} => {
  const matchingVariants = variants.filter((v) => {
    const paperMatches = paperType === null || paperTypeOf(v) === paperType;
    const sizeMatches = sizeKey === null || sizeKeyOf(v) === sizeKey;
    return paperMatches && sizeMatches;
  });

  if (matchingVariants.length === 0) {
    return { matchingVariants, chosenVariant: null };
  }

  const exactMatch = matchingVariants.find((v) => {
    const min = readNumberAttr(v.attributes, "minPages");
    const max = readNumberAttr(v.attributes, "maxPages");
    const minOk = min === null || photoCount >= min;
    const maxOk = max === null || photoCount <= max;
    return minOk && maxOk;
  });

  if (exactMatch) {
    return { matchingVariants, chosenVariant: exactMatch };
  }

  const fallback = [...matchingVariants].sort((a, b) => {
    const minA = readNumberAttr(a.attributes, "minPages") ?? 0;
    const minB = readNumberAttr(b.attributes, "minPages") ?? 0;
    return minA - minB;
  })[0];

  return { matchingVariants, chosenVariant: fallback ?? null };
};
