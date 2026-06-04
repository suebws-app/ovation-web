"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { BookBindingBadge } from "./BookBindingBadge";
import { CustomizerSection } from "./CustomizerSection";
import { VariantSelector } from "./VariantSelector";
import { MediaPicker } from "./MediaPicker";
import { CustomizerCheckoutForm } from "./CustomizerCheckoutForm";
import type {
  Event,
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type Binding = "hardcover" | "softcover" | "layflat";

const bindingFromProductType = (productType: string): Binding => {
  switch (productType) {
    case "hardcover_book":
      return "hardcover";
    case "softcover_book":
      return "softcover";
    case "layflat_book":
      return "layflat";
    default:
      return "hardcover";
  }
};

const readNumberAttr = (
  attributes: Record<string, unknown> | undefined,
  key: string,
): number | null => {
  const value = attributes?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
};

const readStringAttr = (
  attributes: Record<string, unknown> | undefined,
  key: string,
): string | null => {
  const value = attributes?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
};

const readBoolAttr = (
  attributes: Record<string, unknown> | undefined,
  key: string,
): boolean | null => {
  const value = attributes?.[key];
  return typeof value === "boolean" ? value : null;
};

type BookCustomizerProps = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
  event?: Event | null;
  isPro?: boolean;
};

export const BookCustomizer = ({
  product,
  variants,
  eventId,
  event,
  isPro = false,
}: BookCustomizerProps) => {
  const t = useTranslations();
  const binding = bindingFromProductType(product.productType);
  const isHardcover = binding === "hardcover";

  const [variantId, setVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [coverText, setCoverText] = useState("");
  const [dedication, setDedication] = useState("");

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === variantId) ?? null,
    [variants, variantId],
  );

  const variantAttributes = selectedVariant?.attributes;
  const minPages = readNumberAttr(variantAttributes, "minPages");
  const maxPages = readNumberAttr(variantAttributes, "maxPages");
  const pageWidthMm = readNumberAttr(variantAttributes, "pageWidthMm");
  const pageHeightMm = readNumberAttr(variantAttributes, "pageHeightMm");
  const paperStock = readStringAttr(variantAttributes, "paperStock");
  const pricePerPageCents =
    readNumberAttr(variantAttributes, "pricePerPageCents") ?? 0;
  const supportsCoverText =
    readBoolAttr(variantAttributes, "supportsCoverText") ?? true;
  const supportsDedication =
    readBoolAttr(variantAttributes, "supportsDedication") ?? true;

  const pageCount = photoIds.length;
  const pagesWithinRange =
    (minPages === null || pageCount >= minPages) &&
    (maxPages === null || pageCount <= maxPages);

  const basePriceCents = selectedVariant?.priceCents ?? product.basePriceCents;
  const pagesSurchargeCents = pageCount * pricePerPageCents;
  const totalPriceCents = basePriceCents + pagesSurchargeCents;

  const togglePhoto = (id: string) =>
    setPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );

  const customization = useMemo(
    () => ({
      binding,
      variantId: selectedVariant?.id ?? null,
      pages: photoIds.map((mediaId, index) => ({
        mediaId,
        order: index,
      })),
      ...(supportsCoverText && coverText.trim()
        ? { coverText: coverText.trim() }
        : {}),
      ...(supportsDedication && dedication.trim()
        ? { dedication: dedication.trim() }
        : {}),
    }),
    [
      binding,
      selectedVariant?.id,
      photoIds,
      coverText,
      dedication,
      supportsCoverText,
      supportsDedication,
    ],
  );

  const isReady = Boolean(selectedVariant) && pagesWithinRange && pageCount > 0;

  const pageRangeDescription = (() => {
    if (minPages !== null && maxPages !== null) {
      return t("keepsakes__book_customizer__page_range_min_max", {
        min: minPages,
        max: maxPages,
      });
    }
    if (minPages !== null)
      return t("keepsakes__book_customizer__page_range_min", { min: minPages });
    if (maxPages !== null)
      return t("keepsakes__book_customizer__page_range_max", { max: maxPages });
    return null;
  })();

  const notReadyMessage = (() => {
    if (!selectedVariant)
      return t("keepsakes__book_customizer__not_ready_pick_size");
    if (pageCount === 0)
      return t("keepsakes__book_customizer__not_ready_no_photos");
    if (minPages !== null && pageCount < minPages) {
      const remaining = minPages - pageCount;
      return t("keepsakes__book_customizer__not_ready_add_more", {
        count: remaining,
        min: minPages,
      });
    }
    if (maxPages !== null && pageCount > maxPages) {
      const over = pageCount - maxPages;
      return t("keepsakes__book_customizer__not_ready_remove_some", {
        count: over,
        max: maxPages,
      });
    }
    return undefined;
  })();

  const photosBadge =
    minPages !== null && maxPages !== null
      ? t("keepsakes__book_customizer__photos_badge_range", {
          count: pageCount,
          min: minPages,
          max: maxPages,
        })
      : t("keepsakes__book_customizer__photos_badge_selected", {
          count: pageCount,
        });

  return (
    <div className="desktop:grid-cols-[1fr_400px] grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <BookBindingBadge
          binding={binding}
          paperStock={paperStock}
          pageWidthMm={pageWidthMm}
          pageHeightMm={pageHeightMm}
        />

        {variants.length > 0 && (
          <CustomizerSection
            title={t("keepsakes__book_customizer__size_title")}
            description={t("keepsakes__book_customizer__size_description")}
          >
            <VariantSelector
              label={t("keepsakes__book_customizer__size_format_label")}
              variants={variants}
              basePriceCents={product.basePriceCents}
              selectedId={variantId}
              onChange={setVariantId}
            />
            {pageRangeDescription && (
              <p className="type-caption text-muted-foreground mt-2 tracking-wider">
                {pageRangeDescription}
                {paperStock ? ` · ${paperStock}` : ""}
              </p>
            )}
          </CustomizerSection>
        )}

        <CustomizerSection
          title={t("keepsakes__book_customizer__photos_title")}
          description={t("keepsakes__book_customizer__photos_description")}
          badge={photosBadge}
        >
          <MediaPicker
            eventId={eventId}
            type="photo"
            selectedIds={photoIds}
            onToggle={togglePhoto}
            emptyHint={t("keepsakes__book_customizer__photos_empty_hint")}
          />
        </CustomizerSection>

        {isHardcover && (
          <CustomizerSection
            title={t("keepsakes__book_customizer__spine_title")}
            description={t("keepsakes__book_customizer__spine_description")}
          >
            <div className="rounded-12 border-border bg-muted/30 type-body-small text-muted-foreground border px-3 py-2.5">
              {t("keepsakes__book_customizer__spine_body")}
            </div>
          </CustomizerSection>
        )}

        {(supportsCoverText || supportsDedication) && (
          <CustomizerSection
            title={t("keepsakes__book_customizer__personalize_title")}
            description={t(
              "keepsakes__book_customizer__personalize_description",
            )}
          >
            <div className="flex flex-col gap-4">
              {supportsCoverText && (
                <div>
                  <Label htmlFor="book-cover-text" className="mb-2">
                    {t("keepsakes__book_customizer__cover_text_label")}
                  </Label>
                  <Input
                    id="book-cover-text"
                    maxLength={120}
                    value={coverText}
                    onChange={(e) => setCoverText(e.target.value)}
                    placeholder={t(
                      "keepsakes__book_customizer__cover_text_placeholder",
                    )}
                  />
                </div>
              )}
              {supportsDedication && (
                <div>
                  <Label htmlFor="book-dedication" className="mb-2">
                    {t("keepsakes__book_customizer__dedication_label")}
                  </Label>
                  <textarea
                    id="book-dedication"
                    value={dedication}
                    onChange={(e) => setDedication(e.target.value.slice(0, 280))}
                    rows={3}
                    maxLength={280}
                    placeholder={t(
                      "keepsakes__book_customizer__dedication_placeholder",
                    )}
                    className="rounded-12 border-border bg-background type-body-small focus-visible:ring-ring focus-visible:ring-offset-background w-full resize-none border p-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  />
                </div>
              )}
            </div>
          </CustomizerSection>
        )}
      </div>

      <CustomizerCheckoutForm
        product={product}
        eventId={eventId}
        event={event}
        customization={customization}
        photoIds={photoIds}
        selectedVariant={selectedVariant}
        isReady={isReady}
        notReadyMessage={notReadyMessage}
        showEventBadge={isPro}
        unitPriceCents={totalPriceCents}
        priceBreakdown={{
          baseCents: basePriceCents,
          pageCount,
          pricePerPageCents,
          pagesSurchargeCents,
          totalCents: totalPriceCents,
        }}
      />
    </div>
  );
};
