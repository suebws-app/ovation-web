"use client";

import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { CustomizerSection } from "../CustomizerSection";
import { useBookForm } from "./BookFormContext";
import { usePeechoVariantResolver } from "./usePeechoVariantResolver";
import type { KeepsakeProductVariant } from "@/lib/api/types";

type PersonalizeSectionProps = {
  variants: KeepsakeProductVariant[];
  eventId: string | null;
};

const COVER_TEXT_MAX = 120;
const DEDICATION_MAX = 280;

export const PersonalizeSection = ({
  variants,
  eventId,
}: PersonalizeSectionProps) => {
  const t = useTranslations();
  const { register } = useBookForm();
  const { supportsCoverText, supportsDedication } =
    usePeechoVariantResolver(variants, eventId);

  if (!supportsCoverText && !supportsDedication) return null;

  return (
    <CustomizerSection
      title={t("keepsakes__book_customizer__personalize_title")}
      description={t("keepsakes__book_customizer__personalize_description")}
    >
      <div className="flex flex-col gap-4">
        {supportsCoverText && (
          <div>
            <Label htmlFor="book-cover-text" className="mb-2">
              {t("keepsakes__book_customizer__cover_text_label")}
            </Label>
            <Input
              id="book-cover-text"
              maxLength={COVER_TEXT_MAX}
              placeholder={t(
                "keepsakes__book_customizer__cover_text_placeholder",
              )}
              {...register("coverText")}
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
              rows={3}
              maxLength={DEDICATION_MAX}
              placeholder={t(
                "keepsakes__book_customizer__dedication_placeholder",
              )}
              className="rounded-12 border-border bg-background type-body-small focus-visible:ring-ring focus-visible:ring-offset-background w-full resize-none border p-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              {...register("dedication")}
            />
          </div>
        )}
      </div>
    </CustomizerSection>
  );
};
