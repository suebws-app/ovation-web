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
        className="border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring tablet:text-sm min-h-0 flex-1 resize-none rounded-lg border px-3 py-2 font-mono text-base focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};
