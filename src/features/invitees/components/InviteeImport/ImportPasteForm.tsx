"use client";

import { useTranslations } from "next-intl";

type ImportPasteFormProps = {
  value: string;
  onChange: (value: string) => void;
};

const PASTE_INPUT_ID = "invitee-paste";

export const ImportPasteForm = ({ value, onChange }: ImportPasteFormProps) => {
  const t = useTranslations();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <label
        htmlFor={PASTE_INPUT_ID}
        className="type-caption text-muted-foreground"
      >
        {t("invitees__import__paste_label")}
      </label>
      <textarea
        id={PASTE_INPUT_ID}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t("invitees__import__paste_placeholder")}
        className="rounded-12 border-border bg-card type-body-small min-h-0 flex-1 resize-none border p-3 font-mono"
      />
    </div>
  );
};
