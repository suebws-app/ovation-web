"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";

type ImportParseFooterProps = {
  canParse: boolean;
  onParse: () => void;
};

export const ImportParseFooter = ({
  canParse,
  onParse,
}: ImportParseFooterProps) => {
  const t = useTranslations();
  return (
    <div className="flex w-full items-center justify-end">
      <Button
        type="button"
        onClick={onParse}
        disabled={!canParse}
        className="rounded-full"
      >
        {t("invitees__import__paste_cta")}
      </Button>
    </div>
  );
};
