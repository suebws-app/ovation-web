"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { useTranslations } from "next-intl";
import { publicClient } from "@/lib/api/public-client";
import { ApiError } from "@/lib/api/client";

type KioskExitDialogProps = {
  open: boolean;
  slug: string;
  requiresPin: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const KioskExitDialog = ({
  open,
  slug,
  requiresPin,
  onCancel,
  onConfirm,
}: KioskExitDialogProps) => {
  const t = useTranslations();
  const [draft, setDraft] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      startTransition(() => {
        setDraft("");
        setErrorKey(null);
        setVerifying(false);
      });
      return;
    }
    if (!requiresPin) {
      onConfirm();
      return;
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [open, requiresPin, onConfirm]);

  if (!open || !requiresPin) return null;

  const submit = async () => {
    if (draft.length !== 4 || verifying) return;
    setVerifying(true);
    setErrorKey(null);
    try {
      await publicClient.verifyKioskPin(slug, draft);
      onConfirm();
    } catch (error) {
      if (ApiError.isApiError(error) && error.status === 429) {
        setErrorKey("kiosk__gate__rate_limited");
      } else {
        setErrorKey("kiosk__exit__wrong");
      }
      setDraft("");
      inputRef.current?.focus();
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      className="bg-foreground/85 fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="rounded-20 bg-card flex w-full max-w-sm flex-col items-center gap-4 p-7 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="type-h3 font-semibold tracking-tight">
          {t("kiosk__exit__title")}
        </h2>
        <p className="type-body-small text-muted-foreground text-center">
          {t("kiosk__exit__hint")}
        </p>
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          autoComplete="off"
          value={draft}
          disabled={verifying}
          onChange={(e) => {
            setErrorKey(null);
            setDraft(e.target.value.replace(/\D/g, "").slice(0, 4));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") onCancel();
          }}
          className="border-border focus:border-primary type-h2 w-40 rounded-full border-2 px-4 py-2 text-center font-mono tracking-widest transition-colors outline-none disabled:opacity-60"
          placeholder="••••"
        />
        {errorKey && (
          <p className="type-body-small text-destructive" role="alert">
            {t(errorKey)}
          </p>
        )}
        <div className="mt-2 flex w-full gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="border-border hover:bg-background type-body-small flex-1 cursor-pointer rounded-full border px-4 py-2.5 font-semibold transition-colors"
          >
            {t("kiosk__exit__cancel")}
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={draft.length !== 4 || verifying}
            className="bg-primary text-primary-foreground hover:bg-primary/90 type-body-small flex-1 cursor-pointer rounded-full px-4 py-2.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifying
              ? t("kiosk__gate__verifying")
              : t("kiosk__exit__confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};
