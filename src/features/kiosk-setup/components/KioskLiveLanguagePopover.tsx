"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { GlobeIcon } from "@ovation/icons/GlobeIcon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import { getLanguageMeta } from "../languageMeta";
import { KioskLiveLanguageRow } from "./KioskLiveLanguageRow";

const VISIBLE_ROWS_BEFORE_SCROLL = 4;

type KioskLiveLanguagePopoverProps = {
  languages: readonly string[];
  currentLocale: string;
  onSelect: (code: string) => void;
};

export const KioskLiveLanguagePopover = ({
  languages,
  currentLocale,
  onSelect,
}: KioskLiveLanguagePopoverProps) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const currentMeta = getLanguageMeta(currentLocale);

  const sortedMetas = useMemo(
    () =>
      languages
        .map((code) => getLanguageMeta(code))
        .sort((a, b) => a.nativeName.localeCompare(b.nativeName)),
    [languages],
  );

  const handleSelect = (code: string) => {
    setOpen(false);
    onSelect(code);
  };

  const needsScroll = sortedMetas.length > VISIBLE_ROWS_BEFORE_SCROLL;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={t("kiosk__live__language_trigger")}
        className="border-border bg-card/85 hover:bg-card type-body-small inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 font-semibold shadow-sm transition-colors"
      >
        <GlobeIcon width={14} height={14} className="text-muted-foreground" />
        <span className="type-body">{currentMeta.flag}</span>
        {currentMeta.nativeName}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={8}
        className="rounded-16 border-border w-64 gap-0 border p-1.5 shadow-lg"
      >
        <div
          className={
            needsScroll
              ? "flex max-h-72 flex-col gap-0.5 overflow-y-auto"
              : "flex flex-col gap-0.5"
          }
        >
          {sortedMetas.map((meta) => (
            <KioskLiveLanguageRow
              key={meta.code}
              meta={meta}
              active={meta.code === currentLocale}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
