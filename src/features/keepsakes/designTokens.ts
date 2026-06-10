import type { KeepsakeProduct } from "@/lib/api/types";

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
    subtitleKey: "keepsakes__design__fallback__subtitle",
    headlineKey: "keepsakes__design__fallback__headline",
    taglineKey: "keepsakes__design__fallback__tagline",
    gradient: "linear-gradient(135deg, #EFE4D2, #C9B58C)",
  },
  layflat: {
    subtitleKey: "keepsakes__design__fallback__subtitle",
    headlineKey: "keepsakes__design__fallback__headline",
    taglineKey: "keepsakes__design__fallback__tagline",
    gradient: "linear-gradient(135deg, #DDE5F0, #93A8CE)",
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

export const computeStartingPriceCents = (
  variants: Array<{
    priceCents: number | null;
    attributes: Record<string, unknown>;
  }>,
  fallbackCents: number,
): number => {
  const readNumber = (
    attrs: Record<string, unknown>,
    key: string,
  ): number | null => {
    const value = attrs[key];
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  };
  let cheapest: number | null = null;
  for (const variant of variants) {
    if (variant.priceCents === null) continue;
    const minPages = readNumber(variant.attributes, "minPages") ?? 0;
    const pricePerPageCents =
      readNumber(variant.attributes, "pricePerPageCents") ?? 0;
    const start = variant.priceCents + minPages * pricePerPageCents;
    if (cheapest === null || start < cheapest) cheapest = start;
  }
  return cheapest ?? fallbackCents;
};

export const formatPrice = (priceCents: number, currency: string): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceCents / 100);
  } catch {
    return `${(priceCents / 100).toFixed(2)} ${currency}`;
  }
};

export const formatTimeline = (days: string | null | undefined): string => {
  if (!days) return "";
  return `${days} days`;
};
