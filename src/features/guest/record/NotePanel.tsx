"use client";

import { useTranslations } from "next-intl";

const MAX_LENGTH = 200;

type NotePanelProps = {
  value: string;
  onChange: (value: string) => void;
};

export const NotePanel = ({ value, onChange }: NotePanelProps) => {
  const t = useTranslations();
  return (
    <div className="rounded-16 bg-card border-border border p-6">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
        placeholder={t("guest__record__note__placeholder")}
        rows={5}
        maxLength={MAX_LENGTH}
        className="border-border bg-background type-body rounded-12 w-full resize-none border p-4 font-serif leading-relaxed outline-none"
      />
      <div className="type-caption text-muted-foreground mt-2 flex justify-end">
        {t("guest__record__note__counter", {
          count: value.length,
          max: MAX_LENGTH,
        })}
      </div>
    </div>
  );
};
