"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ovation/ui/components/Select";
import { BookBindingBadge } from "./BookBindingBadge";
import { CustomizerSection } from "./CustomizerSection";
import { MediaPicker } from "./MediaPicker";
import { CustomizerCheckoutForm } from "./CustomizerCheckoutForm";
import {
  buildPaperFacets,
  buildSizeFacets,
  ORIENTATION_LABEL_KEY,
  paperTypeLabelKeyFor,
  paperTypeOf,
  pickVariantForFacets,
  readBoolAttr,
  readNumberAttr,
  readStringAttr,
  sizeKeyOf,
} from "./bookFacets";
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

  const paperFacets = useMemo(() => buildPaperFacets(variants), [variants]);

  const firstVariant = variants[0] ?? null;
  const initialPaperType = firstVariant ? paperTypeOf(firstVariant) : null;

  const [selectedPaperType, setSelectedPaperType] = useState<string | null>(
    initialPaperType,
  );

  const sizeFacets = useMemo(() => {
    if (selectedPaperType === null) return [];
    return buildSizeFacets(
      variants.filter((v) => paperTypeOf(v) === selectedPaperType),
    );
  }, [variants, selectedPaperType]);

  const initialSizeKey = firstVariant ? sizeKeyOf(firstVariant) : null;

  const [selectedSizeKey, setSelectedSizeKey] = useState<string | null>(
    initialSizeKey,
  );

  const effectiveSizeKey = useMemo(() => {
    if (sizeFacets.length === 0) return null;
    const stillValid = sizeFacets.some(
      (facet) => facet.sizeKey === selectedSizeKey,
    );
    return stillValid ? selectedSizeKey : (sizeFacets[0]?.sizeKey ?? null);
  }, [sizeFacets, selectedSizeKey]);

  const handlePaperChange = (value: string) => {
    setSelectedPaperType(value);
    const availableSizes = buildSizeFacets(
      variants.filter((v) => paperTypeOf(v) === value),
    );
    const stillValid = availableSizes.some(
      (facet) => facet.sizeKey === selectedSizeKey,
    );
    if (!stillValid) {
      setSelectedSizeKey(availableSizes[0]?.sizeKey ?? null);
    }
  };

  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [coverText, setCoverText] = useState("");
  const [dedication, setDedication] = useState("");

  const pageCount = photoIds.length;

  const { matchingVariants, chosenVariant } = useMemo(
    () =>
      pickVariantForFacets(
        variants,
        selectedPaperType,
        effectiveSizeKey,
        pageCount,
      ),
    [variants, selectedPaperType, effectiveSizeKey, pageCount],
  );

  const selectedVariant = chosenVariant;
  const variantAttributes = selectedVariant?.attributes;
  const minPages = readNumberAttr(variantAttributes, "minPages");
  const maxPages = readNumberAttr(variantAttributes, "maxPages");
  const pageWidthMm = readNumberAttr(variantAttributes, "pageWidthMm");
  const pageHeightMm = readNumberAttr(variantAttributes, "pageHeightMm");
  const paperStock =
    readStringAttr(variantAttributes, "paperStock") ??
    readStringAttr(variantAttributes, "paperType");
  const pricePerPageCents =
    readNumberAttr(variantAttributes, "pricePerPageCents") ?? 0;
  const supportsCoverText =
    readBoolAttr(variantAttributes, "supportsCoverText") ?? true;
  const supportsDedication =
    readBoolAttr(variantAttributes, "supportsDedication") ?? true;

  const noVariantMatch = matchingVariants.length === 0;
  const pagesWithinRange =
    !noVariantMatch &&
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

  const isReady =
    Boolean(selectedVariant) &&
    !noVariantMatch &&
    pagesWithinRange &&
    pageCount > 0;

  const pageCountStatus = (() => {
    if (noVariantMatch) {
      return {
        tone: "error" as const,
        message: t("keepsakes__book_customizer__no_variant_label"),
      };
    }
    if (minPages !== null && pageCount < minPages) {
      return {
        tone: "warn" as const,
        message: t("keepsakes__book_customizer__below_min_label", {
          needed: minPages - pageCount,
          min: minPages,
        }),
      };
    }
    if (maxPages !== null && pageCount > maxPages) {
      return {
        tone: "warn" as const,
        message: t("keepsakes__book_customizer__above_max_label", {
          extra: pageCount - maxPages,
          max: maxPages,
        }),
      };
    }
    return null;
  })();

  const notReadyMessage = (() => {
    if (noVariantMatch)
      return t("keepsakes__book_customizer__no_variant_label");
    if (!selectedVariant)
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

  const paperOptions = paperFacets.map((paperType) => {
    const labelKey = paperTypeLabelKeyFor(paperType);
    return {
      value: paperType,
      label: labelKey ? t(labelKey) : paperType,
    };
  });

  const sizeOptions = sizeFacets.map((facet) => {
    const sizeLabel = facet.labelKey
      ? t(facet.labelKey)
      : t("keepsakes__book_customizer__size_custom", {
          width: facet.widthMm,
          height: facet.heightMm,
        });
    const orientationLabel = t(ORIENTATION_LABEL_KEY[facet.orientation]);
    return {
      value: facet.sizeKey,
      label: `${sizeLabel} · ${orientationLabel} (${facet.widthMm}×${facet.heightMm} mm)`,
    };
  });

  const showPaperSection = paperFacets.length > 0;
  const showSizeSection = paperFacets.length > 0;
  const isPaperDisabled = paperOptions.length <= 1;
  const isSizeDisabled =
    selectedPaperType === null || sizeOptions.length <= 1;
  const sizeHasOptions = sizeOptions.length > 0;

  const paperSelectId = "book-paper-select";
  const sizeSelectId = "book-size-select";

  return (
    <div className="desktop:grid-cols-[1fr_400px] grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <BookBindingBadge
          binding={binding}
          paperStock={paperStock}
          pageWidthMm={pageWidthMm}
          pageHeightMm={pageHeightMm}
        />

        {showPaperSection && (
          <CustomizerSection
            title={t("keepsakes__book_customizer__paper_section_title")}
            description={t(
              "keepsakes__book_customizer__paper_section_description",
            )}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor={paperSelectId}>
                {t("keepsakes__book_customizer__paper_section_title")}
              </Label>
              <Select
                value={selectedPaperType ?? undefined}
                onValueChange={handlePaperChange}
                disabled={isPaperDisabled}
              >
                <SelectTrigger id={paperSelectId} className="w-full">
                  <SelectValue
                    placeholder={t(
                      "keepsakes__book_customizer__paper_placeholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  {paperOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CustomizerSection>
        )}

        {showSizeSection && (
          <CustomizerSection
            title={t("keepsakes__book_customizer__size_section_title")}
            description={t(
              "keepsakes__book_customizer__size_section_description",
            )}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor={sizeSelectId}>
                {t("keepsakes__book_customizer__size_section_title")}
              </Label>
              <Select
                value={effectiveSizeKey ?? undefined}
                onValueChange={(value) => setSelectedSizeKey(value)}
                disabled={isSizeDisabled || !sizeHasOptions}
              >
                <SelectTrigger id={sizeSelectId} className="w-full">
                  <SelectValue
                    placeholder={t(
                      "keepsakes__book_customizer__size_placeholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  {sizeHasOptions ? (
                    sizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__none" disabled>
                      {t("keepsakes__book_customizer__size_no_options")}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CustomizerSection>
        )}

        <CustomizerSection
          title={t("keepsakes__book_customizer__page_count_section_title")}
          description={t("keepsakes__book_customizer__photos_description")}
          badge={photosBadge}
        >
          <div className="flex flex-col gap-3">
            {!noVariantMatch && minPages !== null && maxPages !== null && (
              <p className="type-body-small text-muted-foreground">
                {t("keepsakes__book_customizer__page_range_label", {
                  min: minPages,
                  max: maxPages,
                })}
              </p>
            )}
            <p className="type-body-small text-muted-foreground">
              {t("keepsakes__book_customizer__current_count_label", {
                count: pageCount,
              })}
            </p>
            {pageCountStatus && (
              <p
                role={pageCountStatus.tone === "error" ? "alert" : "status"}
                className={
                  pageCountStatus.tone === "error"
                    ? "type-body-small text-destructive"
                    : "type-body-small text-foreground"
                }
              >
                {pageCountStatus.message}
              </p>
            )}
            {!noVariantMatch && (
              <MediaPicker
                eventId={eventId}
                type="photo"
                selectedIds={photoIds}
                onToggle={togglePhoto}
                emptyHint={t("keepsakes__book_customizer__photos_empty_hint")}
              />
            )}
          </div>
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
