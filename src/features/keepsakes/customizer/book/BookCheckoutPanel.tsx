"use client";

import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { CustomizerCheckoutForm } from "../CustomizerCheckoutForm";
import {
  buildCustomization,
  type BookBinding,
  type BookFormValues,
} from "./BookFormContext";
import { usePeechoVariantResolver } from "./usePeechoVariantResolver";
import type {
  Event,
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type BookCheckoutPanelProps = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
  event?: Event | null;
  binding: BookBinding;
  isPro: boolean;
};

export const BookCheckoutPanel = ({
  product,
  variants,
  eventId,
  event,
  binding,
  isPro,
}: BookCheckoutPanelProps) => {
  const t = useTranslations();
  const {
    chosenVariant,
    pageCount,
    billablePages,
    minPages,
    maxPages,
    pricePerPageCents,
    pagesSurchargeCents,
    pagesWithinRange,
    noVariantMatch,
    supportsCoverText,
    supportsDedication,
  } = usePeechoVariantResolver(variants, eventId);

  const [paperType, sizeKey, photoIds, photoSelectAll, coverText, dedication] =
    useWatch<
      BookFormValues,
      [
        "paperType",
        "sizeKey",
        "photoIds",
        "photoSelectAll",
        "coverText",
        "dedication",
      ]
    >({
      name: [
        "paperType",
        "sizeKey",
        "photoIds",
        "photoSelectAll",
        "coverText",
        "dedication",
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
    if (minPages !== null && pageCount < minPages) {
      return t("keepsakes__book_customizer__below_min_label", {
        needed: minPages - pageCount,
        min: minPages,
      });
    }
    if (maxPages !== null && pageCount > maxPages) {
      return t("keepsakes__book_customizer__above_max_label", {
        extra: pageCount - maxPages,
        max: maxPages,
      });
    }
    return undefined;
  })();

  return (
    <CustomizerCheckoutForm
      product={product}
      eventId={eventId}
      event={event}
      customization={customization}
      photoIds={safePhotoIds}
      photoSelectAll={photoSelectAll ?? null}
      selectedVariant={chosenVariant}
      isReady={isReady}
      notReadyMessage={notReadyMessage}
      showEventBadge={isPro}
      unitPriceCents={totalPriceCents}
      priceBreakdown={{
        baseCents: basePriceCents,
        pageCount: billablePages,
        pricePerPageCents,
        pagesSurchargeCents,
        totalCents: totalPriceCents,
        blankPageAdded: billablePages > pageCount,
      }}
    />
  );
};
