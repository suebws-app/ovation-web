"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@ovation/icons/ChevronDownIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ovation/ui/components/Command";
import { useShippingCountries } from "@/lib/query/shippingQueries";

type CountrySelectProps = {
  value: string;
  onChange: (countryCode: string) => void;
  variantIds: string[];
  invalid?: boolean;
  disabled?: boolean;
};

export const CountrySelect = ({
  value,
  onChange,
  variantIds,
  invalid,
  disabled,
}: CountrySelectProps) => {
  const t = useTranslations();
  const { data, isLoading, isError } = useShippingCountries(variantIds);
  const [open, setOpen] = useState(false);

  const countries = data?.countries ?? [];
  const selected = countries.find((c) => c.countryCode === value);

  const placeholder = isError
    ? t("cart__shipping__country_error")
    : isLoading
      ? t("cart__shipping__country_loading")
      : t("cart__shipping__country_select_placeholder");

  const triggerLabel = selected?.countryName ?? placeholder;
  const isPlaceholder = !selected;

  const handleSelect = (countryCode: string) => {
    onChange(countryCode);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-invalid={invalid}
        disabled={disabled || isLoading}
        className="border-border bg-background hover:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 group flex h-10 w-full cursor-pointer items-center justify-between gap-1.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3"
      >
        <span
          className={
            isPlaceholder
              ? "text-muted-foreground truncate"
              : "text-foreground truncate"
          }
        >
          {triggerLabel}
        </span>
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-150 group-data-[state=open]:rotate-180" />
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter>
          <CommandInput
            placeholder={t("cart__shipping__country_search_placeholder")}
          />
          <CommandList className="max-h-72">
            <CommandEmpty>{t("cart__shipping__country_empty")}</CommandEmpty>
            {countries.map((country) => (
              <CommandItem
                key={country.countryCode}
                value={`${country.countryCode} ${country.countryName}`}
                onSelect={() => handleSelect(country.countryCode)}
              >
                <span className="truncate">{country.countryName}</span>
                {country.countryCode === value && (
                  <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
                    <CheckIcon className="size-3.5" />
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
