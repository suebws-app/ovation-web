"use client";

import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  buildCustomization,
  DEFAULT_COVER_TEMPLATE_ID,
  type BookBinding,
  type BookFormValues,
  type CoverSlot,
} from "./BookFormContext";
import { usePeechoVariantResolver } from "./usePeechoVariantResolver";
import type { KeepsakeProductVariant, PhotoSelectAll } from "@/lib/api/types";

export type BookPriceBreakdown = {
  baseCents: number;
  pageCount: number;
  chargeablePages: number;
  pricePerPageCents: number;
  pagesSurchargeCents: number;
  totalCents: number;
  blankPageAdded?: boolean;
};

export type BookSelectedOptions = {
  paperType: string;
  sizeKey: string;
  interiorDensity: string;
  photoCount: number;
  coverTemplateId: string;
};

/**
 * Central source of truth for the book checkout box AND the read-only order
 * summary: resolves the Peecho variant, watches the form, and derives the
 * customization payload, price breakdown, readiness, and the selected options.
 */
export const useBookCheckoutData = (
  variants: KeepsakeProductVariant[],
  eventId: string | null,
  binding: BookBinding,
) => {
  const t = useTranslations();
  const {
    chosenVariant,
    pageCount,
    billablePages,
    blankPageAdded,
    chargeablePages,
    minPages,
    maxPages,
    pricePerPageCents,
    pagesSurchargeCents,
    pagesWithinRange,
    noVariantMatch,
    supportsCoverText,
    supportsDedication,
  } = usePeechoVariantResolver(variants, eventId, binding);

  const [
    paperType,
    sizeKey,
    photoIds,
    photoSelectAll,
    coverText,
    dedication,
    coverTemplateId,
    coverSlots,
    coverBgColor,
    coverTextColors,
    interiorDensity,
  ] = useWatch<
    BookFormValues,
    [
      "paperType",
      "sizeKey",
      "photoIds",
      "photoSelectAll",
      "coverText",
      "dedication",
      "coverTemplateId",
      "coverSlots",
      "coverBgColor",
      "coverTextColors",
      "interiorDensity",
    ]
  >({
    name: [
      "paperType",
      "sizeKey",
      "photoIds",
      "photoSelectAll",
      "coverText",
      "dedication",
      "coverTemplateId",
      "coverSlots",
      "coverBgColor",
      "coverTextColors",
      "interiorDensity",
    ],
  });

  const basePriceCents = chosenVariant?.priceCents ?? 0;
  const totalPriceCents = basePriceCents + pagesSurchargeCents;
  const safePhotoIds = useMemo(() => photoIds ?? [], [photoIds]);

  const customization = useMemo(
    () =>
      buildCustomization(
        {
          paperType: paperType ?? "",
          sizeKey: sizeKey ?? "",
          photoIds: safePhotoIds,
          photoSelectAll: photoSelectAll ?? null,
          coverText: coverText ?? "",
          dedication: dedication ?? "",
          coverTemplateId: coverTemplateId ?? DEFAULT_COVER_TEMPLATE_ID,
          coverSlots: (coverSlots ?? []) as CoverSlot[],
          coverBgColor: coverBgColor ?? "",
          coverTextColors: coverTextColors ?? {},
          interiorDensity: interiorDensity ?? "spacious",
        },
        chosenVariant,
        binding,
        { supportsCoverText, supportsDedication },
      ),
    [
      paperType,
      sizeKey,
      safePhotoIds,
      photoSelectAll,
      coverText,
      dedication,
      coverTemplateId,
      coverSlots,
      coverBgColor,
      coverTextColors,
      interiorDensity,
      chosenVariant,
      binding,
      supportsCoverText,
      supportsDedication,
    ],
  );

  const isReady =
    Boolean(chosenVariant) &&
    !noVariantMatch &&
    pagesWithinRange &&
    pageCount > 0;

  const notReadyMessage = (() => {
    if (noVariantMatch)
      return t("keepsakes__book_customizer__no_variant_label");
    if (!chosenVariant)
      return t("keepsakes__book_customizer__not_ready_pick_size");
    if (pageCount === 0)
      return t("keepsakes__book_customizer__not_ready_no_photos");
    if (minPages !== null && billablePages < minPages) {
      return t("keepsakes__book_customizer__below_min_label", {
        needed: minPages - billablePages,
        min: minPages,
      });
    }
    if (maxPages !== null && billablePages > maxPages) {
      return t("keepsakes__book_customizer__above_max_label", {
        extra: billablePages - maxPages,
        max: maxPages,
      });
    }
    return undefined;
  })();

  const priceBreakdown: BookPriceBreakdown = {
    baseCents: basePriceCents,
    pageCount: billablePages,
    chargeablePages,
    pricePerPageCents,
    pagesSurchargeCents,
    totalCents: totalPriceCents,
    blankPageAdded,
  };

  const options: BookSelectedOptions = {
    paperType: paperType ?? "",
    sizeKey: sizeKey ?? "",
    interiorDensity: interiorDensity ?? "spacious",
    photoCount: pageCount,
    coverTemplateId: coverTemplateId ?? DEFAULT_COVER_TEMPLATE_ID,
  };

  return {
    selectedVariant: chosenVariant,
    currency: chosenVariant?.currency ?? "EUR",
    priceBreakdown,
    unitPriceCents: totalPriceCents,
    customization,
    photoIds: safePhotoIds,
    photoSelectAll: (photoSelectAll ?? null) as PhotoSelectAll | null,
    isReady,
    notReadyMessage,
    options,
  };
};
