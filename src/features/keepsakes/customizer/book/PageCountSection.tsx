"use client";

import { useCallback, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { CustomizerSection } from "../CustomizerSection";
import { MediaPicker } from "../MediaPicker";
import { useBookForm, type BookFormValues } from "./BookFormContext";
import { usePeechoVariantResolver } from "./usePeechoVariantResolver";
import type {
  Event,
  KeepsakeProductVariant,
  PhotoSelectAll,
} from "@/lib/api/types";

type PageCountSectionProps = {
  variants: KeepsakeProductVariant[];
  eventId: string | null;
  event?: Event | null;
  isPro?: boolean;
};

export const PageCountSection = ({
  variants,
  eventId,
}: PageCountSectionProps) => {
  const t = useTranslations();
  const { setValue } = useBookForm();
  const watchedPhotoIds = useWatch<BookFormValues, "photoIds">({
    name: "photoIds",
  });
  const photoSelectAll = useWatch<BookFormValues, "photoSelectAll">({
    name: "photoSelectAll",
  });
  const photoIds = useMemo(() => watchedPhotoIds ?? [], [watchedPhotoIds]);

  const { minPages, maxPages, pageCount, noVariantMatch } =
    usePeechoVariantResolver(variants, eventId);

  const togglePhoto = useCallback(
    (id: string) => {
      const next = photoIds.includes(id)
        ? photoIds.filter((m) => m !== id)
        : [...photoIds, id];
      setValue("photoIds", next, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [photoIds, setValue],
  );

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
        <p
          role={pageCountStatus?.tone === "error" ? "alert" : "status"}
          aria-hidden={!pageCountStatus}
          className={`type-body-small min-h-5 ${
            pageCountStatus?.tone === "error"
              ? "text-destructive"
              : "text-foreground"
          }`}
        >
          {pageCountStatus?.message ?? " "}
        </p>
        {!noVariantMatch && (
          <MediaPicker
            eventId={eventId}
            type="photo"
            selectedIds={photoIds}
            onToggle={togglePhoto}
            onChange={(next) =>
              setValue("photoIds", next, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            selectAll={photoSelectAll ?? null}
            onSelectAllChange={(next: PhotoSelectAll | null) =>
              setValue("photoSelectAll", next, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            emptyHint={t("keepsakes__book_customizer__photos_empty_hint")}
          />
        )}
      </div>
    </CustomizerSection>
  );
};
