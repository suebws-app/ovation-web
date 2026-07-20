"use client";

import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@ovation/ui/components/Alert";
import { WarningIcon } from "@ovation/icons/WarningIcon";
import { useCoverTemplatesQuery } from "@/lib/query/coverTemplatesQueries";
import { CartSummaryRow } from "@/features/cart/components/CartSummaryRow";
import { paperTypeLabelKeyFor, sizeLabelKeyFor } from "../bookFacets";
import {
  BookPriceBreakdown,
  shouldShowPriceBreakdown,
} from "./BookPriceBreakdown";
import { type BookBinding } from "./BookFormContext";
import { useBookCheckoutData } from "./useBookCheckoutData";
import type {
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type BookOrderSummaryProps = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
  binding: BookBinding;
  bare?: boolean;
  hideNotReady?: boolean;
};

export const BookOrderSummary = ({
  product,
  variants,
  eventId,
  binding,
  bare = false,
  hideNotReady = false,
}: BookOrderSummaryProps) => {
  const t = useTranslations();
  const { data } = useCoverTemplatesQuery();
  const { options, priceBreakdown, currency, notReadyMessage } =
    useBookCheckoutData(variants, eventId, binding);

  const paperKey = paperTypeLabelKeyFor(options.paperType);
  const paperLabel = paperKey ? t(paperKey) : options.paperType || "—";

  const sizeKeyLabel = sizeLabelKeyFor(options.sizeKey);
  const [w, h] = options.sizeKey.split("x");
  const sizeLabel = sizeKeyLabel
    ? t(sizeKeyLabel)
    : w && h
      ? t("keepsakes__book_customizer__size_custom", { width: w, height: h })
      : "—";

  const layoutLabel = t(
    `keepsakes__book_customizer__density_${options.interiorDensity}_label`,
  );

  const coverName =
    (data?.templates ?? []).find((tpl) => tpl.id === options.coverTemplateId)
      ?.name ?? "—";

  return (
    <div
      className={
        bare
          ? "flex flex-col gap-4"
          : "rounded-20 border-border bg-card flex flex-col gap-4 border p-6"
      }
    >
      <h2 className="type-h3 font-serif font-semibold tracking-tight">
        {t("keepsakes__book_customizer__summary_title")}
      </h2>
      <div className="flex flex-col gap-2.5">
        <CartSummaryRow
          label={t("keepsakes__book_customizer__summary_paper")}
          value={paperLabel}
        />
        <CartSummaryRow
          label={t("keepsakes__book_customizer__summary_size")}
          value={sizeLabel}
        />
        <CartSummaryRow
          label={t("keepsakes__book_customizer__summary_layout")}
          value={layoutLabel}
        />
        <CartSummaryRow
          label={t("keepsakes__book_customizer__summary_photos")}
          value={options.photoCount}
        />
        <CartSummaryRow
          label={t("keepsakes__book_customizer__summary_cover")}
          value={coverName}
        />
      </div>
      {shouldShowPriceBreakdown(priceBreakdown) && (
        <BookPriceBreakdown
          priceBreakdown={priceBreakdown}
          currency={currency}
          productName={t(product.name)}
        />
      )}
      {!hideNotReady && notReadyMessage && (
        <Alert variant="warning">
          <WarningIcon width={16} height={16} />
          <AlertDescription>{notReadyMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
