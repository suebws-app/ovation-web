"use client";

import { useTranslations } from "next-intl";
import type { SizeFacet } from "./bookFacets";
import { ORIENTATION_LABEL_KEY } from "./bookFacets";

type BookSizeFacetTileProps = {
  facet: SizeFacet;
  isSelected: boolean;
  onSelect: (sizeKey: string) => void;
};

export const BookSizeFacetTile = ({
  facet,
  isSelected,
  onSelect,
}: BookSizeFacetTileProps) => {
  const t = useTranslations();
  const sizeLabel = facet.labelKey
    ? t(facet.labelKey)
    : t("keepsakes__book_customizer__size_custom", {
        width: facet.widthMm,
        height: facet.heightMm,
      });
  const orientationLabel = t(ORIENTATION_LABEL_KEY[facet.orientation]);

  return (
    <button
      type="button"
      onClick={() => onSelect(facet.sizeKey)}
      aria-pressed={isSelected}
      className={`rounded-16 flex flex-col gap-1 border px-4 py-3 text-left transition ${
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-foreground/20"
      }`}
    >
      <span className="type-body-small font-semibold">{sizeLabel}</span>
      <span className="type-caption text-muted-foreground tracking-wider">
        {orientationLabel}
      </span>
      <span className="type-caption text-muted-foreground">
        {facet.widthMm}×{facet.heightMm} mm
      </span>
    </button>
  );
};
