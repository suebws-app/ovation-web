import type { KeepsakeProduct, KeepsakeProductVariant } from "@/lib/api/types";

export type KeepsakeDesign = {
  subtitleKey: string;
  headlineKey: string;
  taglineKey: string;
  gradient: string;
  dark?: boolean;
  featured?: boolean;
};

const FALLBACK: KeepsakeDesign = {
  subtitleKey: "keepsakes__design__fallback__subtitle",
  headlineKey: "keepsakes__design__fallback__headline",
  taglineKey: "keepsakes__design__fallback__tagline",
  gradient: "linear-gradient(135deg, #EFC9A8, #D8B997)",
};

const DESIGN_BY_PRODUCT_TYPE: Record<string, KeepsakeDesign> = {
  hardcover: {
    subtitleKey: "keepsakes__design__gold_book__subtitle",
    headlineKey: "keepsakes__design__gold_book__headline",
    taglineKey: "keepsakes__design__gold_book__tagline",
    gradient: "linear-gradient(135deg, #F2D7B3, #C99A66)",
    featured: true,
  },
  softcover: {
    subtitleKey: "keepsakes__design__softcover__subtitle",
    headlineKey: "keepsakes__design__softcover__headline",
    taglineKey: "keepsakes__design__softcover__tagline",
    gradient: "linear-gradient(135deg, #EFE4D2, #C9B58C)",
  },
  layflat: {
    subtitleKey: "keepsakes__design__layflat__subtitle",
    headlineKey: "keepsakes__design__layflat__headline",
    taglineKey: "keepsakes__design__layflat__tagline",
    gradient: "linear-gradient(135deg, #DDE5F0, #93A8CE)",
  },
  audio_vinyl: {
    subtitleKey: "keepsakes__design__audio_vinyl__subtitle",
    headlineKey: "keepsakes__design__audio_vinyl__headline",
    taglineKey: "keepsakes__design__audio_vinyl__tagline",
    gradient: "linear-gradient(135deg, #2A2A2A, #555555)",
    dark: true,
  },
  video_montage: {
    subtitleKey: "keepsakes__design__video_montage__subtitle",
    headlineKey: "keepsakes__design__video_montage__headline",
    taglineKey: "keepsakes__design__video_montage__tagline",
    gradient: "linear-gradient(135deg, #4A5A8B, #8FA3CF)",
    dark: true,
  },
  digital_album: {
    subtitleKey: "keepsakes__design__digital_album__subtitle",
    headlineKey: "keepsakes__design__digital_album__headline",
    taglineKey: "keepsakes__design__digital_album__tagline",
    gradient: "linear-gradient(135deg, #C8D8E8, #8AA8C8)",
  },
  thank_you_cards: {
    subtitleKey: "keepsakes__design__thank_you_cards__subtitle",
    headlineKey: "keepsakes__design__thank_you_cards__headline",
    taglineKey: "keepsakes__design__thank_you_cards__tagline",
    gradient: "linear-gradient(135deg, #F8D7D9, #E8A8B0)",
  },
  canvas_print: {
    subtitleKey: "keepsakes__design__canvas_print__subtitle",
    headlineKey: "keepsakes__design__canvas_print__headline",
    taglineKey: "keepsakes__design__canvas_print__tagline",
    gradient: "linear-gradient(135deg, #E0DCC8, #B8AC8C)",
  },
};

export const designFor = (productType: string): KeepsakeDesign =>
  DESIGN_BY_PRODUCT_TYPE[productType] ?? FALLBACK;

export type DesignedProduct = KeepsakeProduct & {
  design: KeepsakeDesign;
};

export const decorate = (product: KeepsakeProduct): DesignedProduct => ({
  ...product,
  design: designFor(product.productType),
});

export const cheapestVariant = (
  variants: KeepsakeProductVariant[],
): KeepsakeProductVariant | null => {
  let best: KeepsakeProductVariant | null = null;
  for (const variant of variants) {
    if (variant.priceCents === null) continue;
    if (best === null || variant.priceCents < (best.priceCents ?? Infinity)) {
      best = variant;
    }
  }
  return best;
};

export const computeStartingPriceCents = (
  variants: KeepsakeProductVariant[],
  fallbackCents: number,
): number => cheapestVariant(variants)?.priceCents ?? fallbackCents;

export { formatMoney as formatPrice } from "@/lib/utils/currency";

export const formatTimeline = (days: string | null | undefined): string => {
  if (!days) return "";
  return `${days} days`;
};
