"use client";

import { useTranslations } from "next-intl";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { formatPrice } from "../../designTokens";
import type { SizeFacet } from "../bookFacets";

const MAX_PX = 72;

type SizeFormatTileProps = {
  facet: SizeFacet;
  label: string;
  selected: boolean;
  onSelect: (sizeKey: string) => void;
};

export const SizeFormatTile = ({
  facet,
  label,
  selected,
  onSelect,
}: SizeFormatTileProps) => {
  const t = useTranslations();
  const scale = MAX_PX / Math.max(facet.widthMm, facet.heightMm);

  return (
    <button
      type="button"
      onClick={() => onSelect(facet.sizeKey)}
      aria-pressed={selected}
      className={`rounded-12 group relative flex min-w-32 flex-col items-center gap-1.5 border-2 p-2 text-center transition-[border-color] duration-200 ${
        selected ? "border-primary" : "hover:border-border border-transparent"
      }`}
    >
      <span className="flex h-20 items-center justify-center">
        <span
          className={`rounded-4 border-2 shadow-sm transition-colors ${
            selected
              ? "border-primary bg-primary/10"
              : "border-border bg-muted group-hover:border-primary/40"
          }`}
          style={{
            width: facet.widthMm * scale,
            height: facet.heightMm * scale,
          }}
        />
      </span>
      <span className="type-caption leading-tight font-medium">{label}</span>
      <span className="type-caption text-muted-foreground leading-tight">
        {facet.widthMm}×{facet.heightMm} mm
      </span>
      {facet.fromPriceCents !== null && (
        <span className="type-caption text-foreground leading-tight font-semibold">
          {t("keepsakes__book_customizer__from_price", {
            price: formatPrice(facet.fromPriceCents, facet.currency),
          })}
        </span>
      )}
      {selected && (
        <span className="bg-primary text-primary-foreground absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full">
          <CheckIcon width={12} height={12} />
        </span>
      )}
    </button>
  );
};
