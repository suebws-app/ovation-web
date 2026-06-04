"use client";

import { useTranslations } from "next-intl";
import { CustomizerSection } from "../CustomizerSection";
import type { BookBinding } from "./BookFormContext";

type SpineNoteProps = {
  binding: BookBinding;
};

export const SpineNote = ({ binding }: SpineNoteProps) => {
  const t = useTranslations();

  if (binding !== "hardcover") return null;

  return (
    <CustomizerSection
      title={t("keepsakes__book_customizer__spine_title")}
      description={t("keepsakes__book_customizer__spine_description")}
    >
      <div className="rounded-12 border-border bg-muted/30 type-body-small text-muted-foreground border px-3 py-2.5">
        {t("keepsakes__book_customizer__spine_body")}
      </div>
    </CustomizerSection>
  );
};
