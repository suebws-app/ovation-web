"use client";

import { useTranslations } from "next-intl";
import { KIOSK_WELCOME_NOTE_MAX } from "@/lib/api/types";

type KioskWelcomeNoteProps = {
  value: string;
  onChange: (value: string) => void;
};

export const KioskWelcomeNote = ({
  value,
  onChange,
}: KioskWelcomeNoteProps) => {
  const t = useTranslations();
  return (
    <div className="py-5">
      <div className="type-caption text-muted-foreground mb-2 font-semibold">
        {t("kiosk__config__welcome__note_label")}
      </div>
      <div className="border-border bg-card focus-within:ring-ring relative min-h-24 rounded-lg border px-3 py-2 transition-colors focus-within:ring-2 focus-within:outline-none">
        <textarea
          value={value}
          onChange={(e) =>
            onChange(e.target.value.slice(0, KIOSK_WELCOME_NOTE_MAX))
          }
          maxLength={KIOSK_WELCOME_NOTE_MAX}
          placeholder={t("kiosk__config__welcome__note_placeholder")}
          className="text-foreground placeholder:text-muted-foreground tablet:text-sm min-h-16 w-full resize-none bg-transparent text-base leading-relaxed outline-none disabled:cursor-not-allowed disabled:opacity-50"
          rows={3}
        />
        <span className="type-caption text-muted-foreground absolute right-3 bottom-1.5">
          {t("kiosk__config__welcome__counter", {
            count: value.length,
            max: KIOSK_WELCOME_NOTE_MAX,
          })}
        </span>
      </div>
    </div>
  );
};
