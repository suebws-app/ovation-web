"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { EyeIcon } from "@ovation/icons/EyeIcon";
import { EyeOffIcon } from "@ovation/icons/EyeOffIcon";

type KioskPinInputProps = {
  pin: string | null;
  onChange: (pin: string) => void;
};

export const KioskPinInput = ({ pin, onChange }: KioskPinInputProps) => {
  const t = useTranslations();
  const [editing, setEditing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [draft, setDraft] = useState("");

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="type-body-small text-foreground min-w-16 text-center font-mono tracking-widest">
          {revealed ? (pin ?? t("kiosk_setup__pin__unknown")) : "••••"}
        </span>
        <button
          type="button"
          onClick={() => setRevealed((current) => !current)}
          aria-label={
            revealed ? t("kiosk_setup__pin__hide") : t("kiosk_setup__pin__show")
          }
          className="border-border bg-card text-muted-foreground hover:bg-background cursor-pointer rounded-lg border p-2 transition-colors"
        >
          {revealed ? (
            <EyeOffIcon width={14} height={14} />
          ) : (
            <EyeIcon width={14} height={14} />
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(pin ?? "");
            setEditing(true);
          }}
          className="border-border bg-card type-body-small hover:bg-background cursor-pointer rounded-lg border px-3.5 py-2 font-mono tracking-widest transition-colors"
        >
          {t("kiosk_setup__pin__change")}
        </button>
      </div>
    );
  }

  const commit = () => {
    setEditing(false);
    if (/^\d{4}$/.test(draft) && draft !== pin) {
      onChange(draft);
    }
  };

  return (
    <input
      autoFocus
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={4}
      value={draft}
      onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 4))}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") setEditing(false);
      }}
      placeholder="••••"
      className="border-primary bg-card type-body-small w-22 rounded-full border-2 px-3.5 py-2 text-center font-mono tracking-widest outline-none"
    />
  );
};
