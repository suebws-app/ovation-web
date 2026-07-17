"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useSupportedCurrencies } from "@/lib/query/currencyQueries";
import { queryKeys } from "@/lib/query/keys";
import { useCurrency } from "@/i18n/useCurrency";
import { buildCurrencyLabel } from "@/lib/utils/currency";
import {
  FALLBACK_CURRENCIES,
  isSupportedCurrency,
  type Currency,
} from "@/i18n/currency-config";
import { ChevronDownIcon } from "@ovation/icons/ChevronDownIcon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@ovation/ui/components/Command";
import { CurrencyOption } from "./CurrencyOption";

type CurrencySelectClientProps = {
  initialCurrency: Currency;
  reloadOnChange?: boolean;
};

export const CurrencySelectClient = ({
  initialCurrency,
  reloadOnChange = true,
}: CurrencySelectClientProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { currency, setCurrency } = useCurrency(initialCurrency);
  const { data } = useSupportedCurrencies();
  const [open, setOpen] = useState(false);

  const availableCurrencies = useMemo<Currency[]>(() => {
    const fromApi = data?.currencies?.filter(isSupportedCurrency);
    if (fromApi && fromApi.length > 0) return fromApi;
    return [...FALLBACK_CURRENCIES];
  }, [data]);

  const handleSelect = (code: Currency) => {
    setOpen(false);
    if (code === currency) return;
    setCurrency(code);
    if (reloadOnChange) {
      window.location.reload();
      return;
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.plans.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.keepsakes.all() });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={t("currency_select__label")}
        className="group hover:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 flex h-8 cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-3"
      >
        <span>{buildCurrencyLabel(currency, locale)}</span>
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-150 group-data-[state=open]:rotate-180" />
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0" align="center">
        <Command shouldFilter>
          <CommandInput
            placeholder={t("currency_select__search_placeholder")}
          />
          <CommandList>
            <CommandEmpty>{t("currency_select__empty")}</CommandEmpty>
            {availableCurrencies.map((code) => (
              <CurrencyOption
                key={code}
                code={code}
                label={buildCurrencyLabel(code, locale)}
                isActive={code === currency}
                onSelect={handleSelect}
              />
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
