"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";

type ImportPreviewToolbarProps = {
  hasHeader: boolean;
  onHeaderChange: (value: boolean) => void;
  onReset: () => void;
};

export const ImportPreviewToolbar = ({
  hasHeader,
  onHeaderChange,
  onReset,
}: ImportPreviewToolbarProps) => {
  const t = useTranslations();

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-3">
      <label className="type-caption text-muted-foreground inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={hasHeader}
          onChange={(event) => onHeaderChange(event.target.checked)}
        />
        {t("invitees__import__has_header")}
      </label>
      <Button
        type="button"
        variant="ghost"
        onClick={onReset}
        className="ml-auto rounded-full"
      >
        {t("invitees__import__reset")}
      </Button>
    </div>
  );
};
