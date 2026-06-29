"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import type { ImportMethod } from "./constants";

type ImportMethodTabProps = {
  method: ImportMethod;
  active: boolean;
  onSelect: (method: ImportMethod) => void;
};

export const ImportMethodTab = ({
  method,
  active,
  onSelect,
}: ImportMethodTabProps) => {
  const t = useTranslations();
  return (
    <button
      type="button"
      onClick={() => onSelect(method)}
      className={cn(
        "type-caption rounded-full px-4 py-1.5 transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {t(`invitees__import__method__${method}`)}
    </button>
  );
};
