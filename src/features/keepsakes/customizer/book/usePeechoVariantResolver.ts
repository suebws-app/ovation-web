"use client";

import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import {
  pickVariantForFacets,
  readBoolAttr,
  readNumberAttr,
  readStringAttr,
} from "../bookFacets";
import { useGalleryCount } from "@/lib/query/galleryQueries";
import type { BookFormValues } from "./BookFormContext";
import { computeRenderedBookPages } from "@/lib/utils/billablePages";
import type { KeepsakeProductVariant } from "@/lib/api/types";
import type { BookBinding } from "./BookFormContext";

export type PeechoVariantResolution = {
  chosenVariant: KeepsakeProductVariant | null;
  matchingVariants: KeepsakeProductVariant[];
  pageCount: number;
  billablePages: number;
  blankPageAdded: boolean;
  chargeablePages: number;
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
  eventId: string | null = null,
  binding: BookBinding = "hardcover",
): PeechoVariantResolution => {
  const [paperType, sizeKey, photoIds, photoSelectAll] = useWatch<
    BookFormValues,
    ["paperType", "sizeKey", "photoIds", "photoSelectAll"]
  >({
    name: ["paperType", "sizeKey", "photoIds", "photoSelectAll"],
  });

  const countQuery = useGalleryCount(eventId ?? "", {
    type: "photo",
    filter: photoSelectAll?.filter ?? "all",
    includeOwnerUploads: true,
  });

  const pageCount = photoSelectAll
    ? Math.max(
        0,
        (countQuery.data?.count ?? 0) - photoSelectAll.excludedIds.length,
      )
    : (photoIds?.length ?? 0);

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

    const isLayflat = binding === "layflat";
    const photoPages = isLayflat ? pageCount * 2 : pageCount;
    const blankPageAdded = pageCount > 0 && (2 + photoPages) % 2 !== 0;
    const billablePages =
      pageCount > 0 ? computeRenderedBookPages(pageCount, isLayflat) : 0;
    const chargeablePages = billablePages;
    const basePriceCents = chosenVariant?.priceCents ?? null;
    const pagesSurchargeCents = chargeablePages * pricePerPageCents;
    const totalPriceCents =
      basePriceCents === null ? null : basePriceCents + pagesSurchargeCents;

    return {
      chosenVariant,
      matchingVariants,
      pageCount,
      billablePages,
      blankPageAdded,
      chargeablePages,
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
  }, [variants, paperType, sizeKey, pageCount, binding]);
};
