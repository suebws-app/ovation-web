"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@ovation/ui/components/Alert";
import { WarningIcon } from "@ovation/icons/WarningIcon";
import { contrastRatio } from "@/lib/utils/color";
import { CoverColorPicker } from "./CoverColorPicker";
import { useBookForm } from "./BookFormContext";
import type { CoverTextElement, CoverTextSource } from "@/lib/api/types";

// Below this WCAG ratio text reads as near-invisible against the background.
// Kept under 3.0 (AA large-text) so intentionally subtle template defaults
// (e.g. champagne date on ivory ~2.4) do not false-trigger.
const MIN_CONTRAST_RATIO = 2;

const sourceLabelKey = (source: CoverTextSource): string => {
  if (typeof source === "object") return "cover_text_color_el_title";
  switch (source) {
    case "coupleNames":
      return "cover_text_color_el_names";
    case "weddingDate":
      return "cover_text_color_el_date";
    case "coverSubtitle":
      return "cover_text_color_el_subtitle";
    default:
      return "cover_text_color_el_title";
  }
};

type CoverTextColorControlsProps = {
  textElements: CoverTextElement[];
  values: Record<string, string>;
  effectiveBg: string;
};

export const CoverTextColorControls = ({
  textElements,
  values,
  effectiveBg,
}: CoverTextColorControlsProps) => {
  const t = useTranslations();
  const { setValue } = useBookForm();

  const setColor = (id: string, hex: string) =>
    setValue(
      "coverTextColors",
      { ...values, [id]: hex },
      { shouldDirty: true },
    );

  const resetColor = (id: string) => {
    const next = { ...values };
    delete next[id];
    setValue("coverTextColors", next, { shouldDirty: true });
  };

  const lowContrastLabels = useMemo(() => {
    const labels: string[] = [];
    for (const el of textElements) {
      const color = values[el.id] || el.color;
      const ratio = contrastRatio(color, effectiveBg);
      if (ratio !== null && ratio < MIN_CONTRAST_RATIO) {
        labels.push(
          t(`keepsakes__book_customizer__${sourceLabelKey(el.source)}`),
        );
      }
    }
    return labels;
  }, [textElements, values, effectiveBg, t]);

  if (textElements.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="type-body-small font-semibold">
          {t("keepsakes__book_customizer__cover_text_color_title")}
        </h3>
        <p className="type-caption text-muted-foreground mt-0.5 leading-relaxed">
          {t("keepsakes__book_customizer__cover_text_color_description")}
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {textElements.map((el) => (
          <CoverColorPicker
            key={el.id}
            label={t(
              `keepsakes__book_customizer__${sourceLabelKey(el.source)}`,
            )}
            value={values[el.id] ?? ""}
            defaultHex={el.color}
            onChange={(hex) => setColor(el.id, hex)}
            onReset={() => resetColor(el.id)}
          />
        ))}
      </div>

      {lowContrastLabels.length > 0 && (
        <Alert variant="warning">
          <WarningIcon />
          <AlertDescription className="type-caption">
            {t("keepsakes__book_customizer__cover_contrast_warning", {
              elements: lowContrastLabels.join(", "),
            })}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
