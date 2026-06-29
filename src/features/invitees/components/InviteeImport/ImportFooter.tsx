"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";

type ImportFooterProps = {
  validCount: number;
  invalidCount: number;
  isSubmitting: boolean;
  onConfirm: () => void;
};

export const ImportFooter = ({
  validCount,
  invalidCount,
  isSubmitting,
  onConfirm,
}: ImportFooterProps) => {
  const t = useTranslations();
  const canConfirm = validCount > 0 && !isSubmitting;

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <p className="type-caption text-muted-foreground">
        {t("invitees__import__summary", {
          valid: validCount,
          invalid: invalidCount,
        })}
      </p>
      <Button
        type="button"
        onClick={onConfirm}
        disabled={!canConfirm}
        className="rounded-full"
      >
        {isSubmitting
          ? t("invitees__import__submitting")
          : t("invitees__import__confirm", { count: validCount })}
      </Button>
    </div>
  );
};
