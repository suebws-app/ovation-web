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

const DESIGN_BY_SKU: Record<string, KeepsakeDesign> = {
  hardcover_book: {
    subtitleKey: "keepsakes__design__gold_book__subtitle",
    headlineKey: "keepsakes__design__gold_book__headline",
    taglineKey: "keepsakes__design__gold_book__tagline",
    gradient: "linear-gradient(135deg, #F2D7B3, #C99A66)",
    featured: true,
  },
  softcover_book: {
    subtitleKey: "keepsakes__design__fallback__subtitle",
    headlineKey: "keepsakes__design__fallback__headline",
    taglineKey: "keepsakes__design__fallback__tagline",
    gradient: "linear-gradient(135deg, #EFE4D2, #C9B58C)",
  },
  layflat_book: {
    subtitleKey: "keepsakes__design__fallback__subtitle",
    headlineKey: "keepsakes__design__fallback__headline",
    taglineKey: "keepsakes__design__fallback__tagline",
    gradient: "linear-gradient(135deg, #DDE5F0, #93A8CE)",
  },
};

export const designFor = (sku: string): KeepsakeDesign =>
  DESIGN_BY_SKU[sku] ?? FALLBACK;

export type DesignedProduct = KeepsakeProduct & {
  design: KeepsakeDesign;
};

export const decorate = (product: KeepsakeProduct): DesignedProduct => ({
  ...product,
  design: designFor(product.sku),
});

export const formatPrice = (priceCents: number, currency: string): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(priceCents / 100);
  } catch {
    return `${(priceCents / 100).toFixed(0)} ${currency}`;
  }
};

export const formatTimeline = (days: string | null | undefined): string => {
  if (!days) return "";
  return `${days} days`;
};
