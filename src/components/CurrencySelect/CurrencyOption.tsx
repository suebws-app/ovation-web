"use client";

import { CommandItem } from "@ovation/ui/components/Command";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { type Currency } from "@/i18n/currency-config";

type CurrencyOptionProps = {
  code: Currency;
  label: string;
  isActive: boolean;
  onSelect: (code: Currency) => void;
};

export const CurrencyOption = ({
  code,
  label,
  isActive,
  onSelect,
}: CurrencyOptionProps) => (
  <CommandItem value={`${code} ${label}`} onSelect={() => onSelect(code)}>
    <span>{label}</span>
    {isActive && (
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <CheckIcon className="size-3.5" />
      </span>
    )}
  </CommandItem>
);
