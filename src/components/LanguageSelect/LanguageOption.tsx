"use client";

import { CommandItem } from "@ovation/ui/components/Command";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { type Locale } from "@/i18n/config";

type LanguageOptionProps = {
  code: Locale;
  label: string;
  isActive: boolean;
  onSelect: (code: Locale) => void;
};

export const LanguageOption = ({
  code,
  label,
  isActive,
  onSelect,
}: LanguageOptionProps) => (
  <CommandItem value={`${code} ${label}`} onSelect={() => onSelect(code)}>
    <span>{label}</span>
    {isActive && (
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <CheckIcon className="size-3.5" />
      </span>
    )}
  </CommandItem>
);
