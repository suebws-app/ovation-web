"use client";

import { useMemo, useState } from "react";
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
  const supportsCoverText =
    readBoolAttr(variantAttributes, "supportsCoverText") ?? true;
  const supportsDedication =
    readBoolAttr(variantAttributes, "supportsDedication") ?? true;

  const pageCount = photoIds.length;
  const pagesWithinRange =
    (minPages === null || pageCount >= minPages) &&
    (maxPages === null || pageCount <= maxPages);

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
      return `${minPages}–${maxPages} pages`;
    }
    if (minPages !== null) return `Min ${minPages} pages`;
    if (maxPages !== null) return `Max ${maxPages} pages`;
    return null;
  })();

  const notReadyMessage = (() => {
    if (!selectedVariant) return "Pick a book size to continue.";
    if (pageCount === 0) return "Add at least one photo to your book.";
    if (minPages !== null && pageCount < minPages) {
      const remaining = minPages - pageCount;
      return `Add ${remaining} more photo${remaining === 1 ? "" : "s"} to reach the minimum (${minPages}).`;
    }
    if (maxPages !== null && pageCount > maxPages) {
      const over = pageCount - maxPages;
      return `Remove ${over} photo${over === 1 ? "" : "s"} — this book holds up to ${maxPages}.`;
    }
    return undefined;
  })();

  const photosBadge =
    minPages !== null && maxPages !== null
      ? `${pageCount} of ${minPages}–${maxPages}`
      : `${pageCount} selected`;

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
            title="Size"
            description="Pick the size and page range for your book."
          >
            <VariantSelector
              label="Format"
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
          title="Photos"
          description="Pick the photos to include. Their order becomes the page order."
          badge={photosBadge}
        >
          <MediaPicker
            eventId={eventId}
            type="photo"
            selectedIds={photoIds}
            onToggle={togglePhoto}
            emptyHint="No photos yet. Invite guests to upload."
          />
        </CustomizerSection>

        {isHardcover && (
          <CustomizerSection
            title="Spine"
            description="Spine width is calculated automatically once your book is sent for print."
          >
            <div className="rounded-12 border-border bg-muted/30 type-body-small text-muted-foreground border px-3 py-2.5">
              Spine width will be calculated by Peecho based on your final page
              count and paper stock.
            </div>
          </CustomizerSection>
        )}

        {(supportsCoverText || supportsDedication) && (
          <CustomizerSection
            title="Personalize"
            description="Optional touches printed inside your book."
          >
            <div className="flex flex-col gap-4">
              {supportsCoverText && (
                <div>
                  <Label htmlFor="book-cover-text" className="mb-2">
                    Cover text (optional)
                  </Label>
                  <Input
                    id="book-cover-text"
                    maxLength={120}
                    value={coverText}
                    onChange={(e) => setCoverText(e.target.value)}
                    placeholder="Anna & Marc · 14 June 2025"
                  />
                </div>
              )}
              {supportsDedication && (
                <div>
                  <Label htmlFor="book-dedication" className="mb-2">
                    Dedication (optional)
                  </Label>
                  <textarea
                    id="book-dedication"
                    value={dedication}
                    onChange={(e) => setDedication(e.target.value.slice(0, 280))}
                    rows={3}
                    maxLength={280}
                    placeholder="For everyone who joined us in celebrating…"
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
      />
    </div>
  );
};
