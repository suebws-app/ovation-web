"use client";

import { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { buildSizeFacets, paperTypeOf, type SizeFacet } from "../bookFacets";
import { CustomizerSection } from "../CustomizerSection";
import { useBookForm, type BookFormValues } from "./BookFormContext";
import { SizeFormatTile } from "./SizeFormatTile";
import type { KeepsakeProductVariant } from "@/lib/api/types";

type SizeSelectProps = {
  variants: KeepsakeProductVariant[];
};

export const SizeSelect = ({ variants }: SizeSelectProps) => {
  const t = useTranslations();
  const { setValue } = useBookForm();
  const [paperType, sizeKey] = useWatch<
    BookFormValues,
    ["paperType", "sizeKey"]
  >({ name: ["paperType", "sizeKey"] });

  const sizeFacets = useMemo(() => {
    if (!paperType) return [];
    return buildSizeFacets(
      variants.filter((v) => paperTypeOf(v) === paperType),
    );
  }, [variants, paperType]);

  const labelFor = (facet: SizeFacet): string =>
    facet.labelKey
      ? t(facet.labelKey)
      : t("keepsakes__book_customizer__size_custom", {
          width: facet.widthMm,
          height: facet.heightMm,
        });

  const hasValidSelection = sizeFacets.some((f) => f.sizeKey === sizeKey);

  useEffect(() => {
    if (sizeFacets.length > 0 && !hasValidSelection) {
      setValue("sizeKey", sizeFacets[0].sizeKey, { shouldDirty: true });
    }
  }, [sizeFacets, hasValidSelection, setValue]);

  const selectSize = (nextSizeKey: string) =>
    setValue("sizeKey", nextSizeKey, { shouldDirty: true });

  return (
    <CustomizerSection
      title={t("keepsakes__book_customizer__size_section_title")}
      description={t("keepsakes__book_customizer__size_section_description")}
    >
      {sizeFacets.length === 0 ? (
        <p className="type-caption text-muted-foreground">
          {t("keepsakes__book_customizer__size_no_options")}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sizeFacets.map((facet) => (
            <SizeFormatTile
              key={facet.sizeKey}
              facet={facet}
              label={labelFor(facet)}
              selected={facet.sizeKey === sizeKey}
              onSelect={selectSize}
            />
          ))}
        </div>
      )}
    </CustomizerSection>
  );
};
