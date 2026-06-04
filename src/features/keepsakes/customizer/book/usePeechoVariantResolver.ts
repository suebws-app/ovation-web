"use client";

import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import {
  pickVariantForFacets,
  readBoolAttr,
  readNumberAttr,
  readStringAttr,
} from "../bookFacets";
import type { BookFormValues } from "./BookFormContext";
import type { KeepsakeProductVariant } from "@/lib/api/types";

export type PeechoVariantResolution = {
  chosenVariant: KeepsakeProductVariant | null;
  matchingVariants: KeepsakeProductVariant[];
  pageCount: number;
  minPages: number | null;
  maxPages: number | null;
  pricePerPageCents: number;
  basePriceCents: number | null;
  totalPriceCents: number | null;
  pagesSurchargeCents: number;
  pagesWithinRange: boolean;
  noVariantMatch: boolean;
  paperStock: string | null;
  pageWidthMm: number | null;
  pageHeightMm: number | null;
  supportsCoverText: boolean;
  supportsDedication: boolean;
};

export const usePeechoVariantResolver = (
  variants: KeepsakeProductVariant[],
): PeechoVariantResolution => {
  const [paperType, sizeKey, photoIds] = useWatch<
    BookFormValues,
    ["paperType", "sizeKey", "photoIds"]
  >({
    name: ["paperType", "sizeKey", "photoIds"],
  });

  const pageCount = photoIds?.length ?? 0;

  return useMemo(() => {
    const { matchingVariants, chosenVariant } = pickVariantForFacets(
      variants,
      paperType ?? null,
      sizeKey ?? null,
      pageCount,
    );

    const attributes = chosenVariant?.attributes;
    const minPages = readNumberAttr(attributes, "minPages");
    const maxPages = readNumberAttr(attributes, "maxPages");
    const pageWidthMm = readNumberAttr(attributes, "pageWidthMm");
    const pageHeightMm = readNumberAttr(attributes, "pageHeightMm");
    const paperStock =
      readStringAttr(attributes, "paperStock") ??
      readStringAttr(attributes, "paperType");
    const pricePerPageCents =
      readNumberAttr(attributes, "pricePerPageCents") ?? 0;
    const supportsCoverText =
      readBoolAttr(attributes, "supportsCoverText") ?? true;
    const supportsDedication =
      readBoolAttr(attributes, "supportsDedication") ?? true;

    const noVariantMatch = matchingVariants.length === 0;
    const pagesWithinRange =
      !noVariantMatch &&
      (minPages === null || pageCount >= minPages) &&
      (maxPages === null || pageCount <= maxPages);

    const basePriceCents = chosenVariant?.priceCents ?? null;
    const pagesSurchargeCents = pageCount * pricePerPageCents;
    const totalPriceCents =
      basePriceCents === null ? null : basePriceCents + pagesSurchargeCents;

    return {
      chosenVariant,
      matchingVariants,
      pageCount,
      minPages,
      maxPages,
      pricePerPageCents,
      basePriceCents,
      totalPriceCents,
      pagesSurchargeCents,
      pagesWithinRange,
      noVariantMatch,
      paperStock,
      pageWidthMm,
      pageHeightMm,
      supportsCoverText,
      supportsDedication,
    };
  }, [variants, paperType, sizeKey, pageCount]);
};
