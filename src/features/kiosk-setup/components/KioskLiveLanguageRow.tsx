"use client";

import { CheckIcon } from "@ovation/icons/CheckIcon";
import { cn } from "@ovation/ui/utils/cn";
import type { LanguageMeta } from "../languageMeta";

type KioskLiveLanguageRowProps = {
  meta: LanguageMeta;
  active: boolean;
  onSelect: (code: string) => void;
};

export const KioskLiveLanguageRow = ({
  meta,
  active,
  onSelect,
}: KioskLiveLanguageRowProps) => {
  const showEnglish =
    meta.englishName.toLowerCase() !== meta.nativeName.toLowerCase();
  return (
    <button
      type="button"
      onClick={() => onSelect(meta.code)}
      aria-pressed={active}
      className={cn(
        "rounded-10 hover:bg-muted flex w-full cursor-pointer items-center gap-3 px-2.5 py-2 text-left transition-colors",
        active && "bg-muted",
      )}
    >
      <span className="type-body leading-none">{meta.flag}</span>
      <span className="flex flex-1 flex-col items-start">
        <span className="type-body-small text-foreground font-semibold">
          {meta.nativeName}
        </span>
        {showEnglish && (
          <span className="type-caption text-muted-foreground">
            {meta.englishName}
          </span>
        )}
      </span>
      {active && (
        <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full">
          <CheckIcon width={11} height={11} />
        </span>
      )}
    </button>
  );
};
