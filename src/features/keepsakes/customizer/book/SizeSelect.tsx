"use client";

import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Label } from "@ovation/ui/components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ovation/ui/components/Select";
import {
  buildSizeFacets,
  ORIENTATION_LABEL_KEY,
  paperTypeOf,
} from "../bookFacets";
import { CustomizerSection } from "../CustomizerSection";
import { useBookForm, type BookFormValues } from "./BookFormContext";
import type { KeepsakeProductVariant } from "@/lib/api/types";

type SizeSelectProps = {
  variants: KeepsakeProductVariant[];
};

const SIZE_SELECT_ID = "book-size-select";

export const SizeSelect = ({ variants }: SizeSelectProps) => {
  const t = useTranslations();
  const { control } = useBookForm();
  const paperType = useWatch<BookFormValues, "paperType">({ name: "paperType" });

  const sizeFacets = useMemo(() => {
    if (!paperType) return [];
    return buildSizeFacets(
      variants.filter((v) => paperTypeOf(v) === paperType),
    );
  }, [variants, paperType]);

  const sizeOptions = useMemo(
    () =>
      sizeFacets.map((facet) => {
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
      }),
    [sizeFacets, t],
  );

  const hasOptions = sizeOptions.length > 0;
  const isDisabled = !paperType || sizeOptions.length <= 1;

  return (
    <CustomizerSection
      title={t("keepsakes__book_customizer__size_section_title")}
      description={t("keepsakes__book_customizer__size_section_description")}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor={SIZE_SELECT_ID}>
          {t("keepsakes__book_customizer__size_section_title")}
        </Label>
        <Controller
          control={control}
          name="sizeKey"
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
              disabled={isDisabled || !hasOptions}
            >
              <SelectTrigger id={SIZE_SELECT_ID} className="w-full">
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
                {hasOptions ? (
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
          )}
        />
      </div>
    </CustomizerSection>
  );
};
