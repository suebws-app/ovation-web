"use client";

import { useMemo } from "react";
import { Controller } from "react-hook-form";
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
  buildPaperFacets,
  buildSizeFacets,
  paperTypeLabelKeyFor,
  paperTypeOf,
} from "../bookFacets";
import { CustomizerSection } from "../CustomizerSection";
import { useBookForm } from "./BookFormContext";
import type { KeepsakeProductVariant } from "@/lib/api/types";

type PaperSelectProps = {
  variants: KeepsakeProductVariant[];
};

const PAPER_SELECT_ID = "book-paper-select";

export const PaperSelect = ({ variants }: PaperSelectProps) => {
  const t = useTranslations();
  const { control, getValues, setValue } = useBookForm();

  const paperFacets = useMemo(() => buildPaperFacets(variants), [variants]);

  const paperOptions = useMemo(
    () =>
      paperFacets.map((paperType) => {
        const labelKey = paperTypeLabelKeyFor(paperType);
        return {
          value: paperType,
          label: labelKey ? t(labelKey) : paperType,
        };
      }),
    [paperFacets, t],
  );

  if (paperFacets.length === 0) return null;

  const isDisabled = paperOptions.length <= 1;

  return (
    <CustomizerSection
      title={t("keepsakes__book_customizer__paper_section_title")}
      description={t("keepsakes__book_customizer__paper_section_description")}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor={PAPER_SELECT_ID}>
          {t("keepsakes__book_customizer__paper_section_title")}
        </Label>
        <Controller
          control={control}
          name="paperType"
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={(next) => {
                field.onChange(next);
                const sizes = buildSizeFacets(
                  variants.filter((v) => paperTypeOf(v) === next),
                );
                const currentSize = getValues("sizeKey");
                const stillValid = sizes.some(
                  (facet) => facet.sizeKey === currentSize,
                );
                if (!stillValid) {
                  setValue("sizeKey", sizes[0]?.sizeKey ?? "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
              disabled={isDisabled}
            >
              <SelectTrigger id={PAPER_SELECT_ID} className="w-full">
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
          )}
        />
      </div>
    </CustomizerSection>
  );
};
