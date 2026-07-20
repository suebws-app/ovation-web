"use client";

import { useTranslations } from "next-intl";
import { InfoHint } from "../InfoHint";
import type { BookPriceBreakdown as PriceBreakdown } from "./useBookCheckoutData";

export const formatPricePrecise = (
  priceCents: number,
  currency: string,
): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(priceCents / 100);
  } catch {
    return `${(priceCents / 100).toFixed(2)} ${currency}`;
  }
};

export const shouldShowPriceBreakdown = (
  priceBreakdown?: PriceBreakdown,
): boolean =>
  Boolean(
    priceBreakdown &&
    priceBreakdown.pricePerPageCents > 0 &&
    priceBreakdown.pageCount > 0,
  );

type BookPriceBreakdownProps = {
  priceBreakdown: PriceBreakdown;
  currency: string;
  productName: string;
};

export const BookPriceBreakdown = ({
  priceBreakdown,
  currency,
  productName,
}: BookPriceBreakdownProps) => {
  const t = useTranslations();
  return (
    <div className="rounded-12 border-border bg-muted/30 flex flex-col gap-1.5 border px-3 py-2.5">
      <div className="type-body-small text-muted-foreground flex items-center justify-between gap-2">
        <span>
          {t("keepsakes__book_customizer__price_base", {
            name: productName,
            count: 0,
          })}
        </span>
        <span>{formatPricePrecise(priceBreakdown.baseCents, currency)}</span>
      </div>
      {priceBreakdown.chargeablePages > 0 && (
        <div className="type-body-small text-muted-foreground flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1">
            {t("keepsakes__book_customizer__price_pages_line", {
              count: priceBreakdown.chargeablePages,
              perPage: formatPricePrecise(
                priceBreakdown.pricePerPageCents,
                currency,
              ),
            })}
            <InfoHint
              label={t("keepsakes__book_customizer__reserved_pages_hint")}
            />
          </span>
          <span>
            {formatPricePrecise(priceBreakdown.pagesSurchargeCents, currency)}
          </span>
        </div>
      )}
      <p
        aria-hidden={!priceBreakdown.blankPageAdded}
        className={`type-caption text-muted-foreground ${
          priceBreakdown.blankPageAdded ? "" : "invisible"
        }`}
      >
        {t("keepsakes__book_customizer__price_blank_page_note")}
      </p>
      <div className="border-border type-body-small mt-1 flex items-center justify-between gap-2 border-t pt-1.5 font-semibold">
        <span>{t("keepsakes__book_customizer__price_total")}</span>
        <span>{formatPricePrecise(priceBreakdown.totalCents, currency)}</span>
      </div>
      <p className="type-caption text-muted-foreground">
        {t("keepsakes__book_customizer__price_vat_note")}
      </p>
    </div>
  );
};
