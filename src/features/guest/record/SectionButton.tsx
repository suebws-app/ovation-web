"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { Plus } from "@ovation/icons/Plus";
import type { Mic } from "@ovation/icons/Mic";
import type { SectionKey } from "./SectionPicker";

type SectionButtonProps = {
  section: {
    key: SectionKey;
    labelKey: string;
    icon: typeof Mic;
  };
  open: boolean;
  filled: boolean;
  onToggle: (key: SectionKey) => void;
};

export const SectionButton = ({
  section,
  open,
  filled,
  onToggle,
}: SectionButtonProps) => {
  const t = useTranslations();
  const Icon = section.icon;
  return (
    <button
      type="button"
      onClick={() => onToggle(section.key)}
      className={cn(
        "rounded-12 type-body-small flex items-center gap-2 px-3 py-2.5 font-semibold transition-colors",
        open
          ? "bg-foreground text-background"
          : "border-border text-muted-foreground hover:bg-background border bg-transparent",
      )}
    >
      <Icon width={14} height={14} />
      {t(section.labelKey)}
      {filled && <span className="bg-secondary ml-auto size-1.5 rounded-full" />}
      {!open && <Plus width={12} height={12} className="ml-auto opacity-60" />}
    </button>
  );
};
