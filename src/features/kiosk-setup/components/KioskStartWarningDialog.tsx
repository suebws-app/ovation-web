"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

type KioskStartWarningDialogProps = {
  open: boolean;
  missingFullscreenLock: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const KioskStartWarningDialog = ({
  open,
  missingFullscreenLock,
  onCancel,
  onConfirm,
}: KioskStartWarningDialogProps) => {
  const t = useTranslations();

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
      if (event.key === "Enter") onConfirm();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      className="bg-foreground/85 fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="rounded-20 bg-card flex w-full max-w-sm flex-col gap-4 p-7 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="type-h3 text-center font-semibold tracking-tight">
          {t("kiosk__start_warning__title")}
        </h2>
        <p className="type-body-small text-muted-foreground">
          {t("kiosk__start_warning__intro")}
        </p>
        <ul className="type-body-small text-foreground list-disc space-y-1 pl-5">
          {missingFullscreenLock && (
            <li>{t("kiosk__start_warning__missing_lock")}</li>
          )}
        </ul>
        <p className="type-caption text-muted-foreground">
          {t("kiosk__start_warning__hint")}
        </p>
        <div className="mt-2 flex w-full gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="border-border hover:bg-background type-body-small flex-1 cursor-pointer rounded-full border px-4 py-2.5 font-semibold transition-colors"
          >
            {t("kiosk__start_warning__cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90 type-body-small flex-1 cursor-pointer rounded-full px-4 py-2.5 font-semibold transition-colors"
          >
            {t("kiosk__start_warning__confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};
