"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, getPathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";
import { formatNativeLanguageName } from "@/lib/utils/localeFormatters";
import { setCookie } from "@/lib/utils/cookies";
import { GlobeIcon } from "@ovation/icons/GlobeIcon";
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
import { LanguageOption } from "./LanguageOption";

const NEXT_LOCALE_COOKIE_MAX_AGE = 31536000;

export const LanguageSelect = () => {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleSelect = (code: Locale) => {
    setOpen(false);
    if (code === locale) return;
    setCookie("NEXT_LOCALE", code, { maxAge: NEXT_LOCALE_COOKIE_MAX_AGE });
    // Full navigation bypasses the Next.js router cache so the destination
    // locale's RSC payload is always fetched fresh — soft-nav via router.replace
    // was returning stale content for statically-rendered marketing routes.
    const nextUrl = getPathname({ href: pathname, locale: code });
    window.location.assign(nextUrl);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={t("language_select__label")}
        className="group hover:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-3"
      >
        <GlobeIcon className="size-3.5 shrink-0" />
        <span>{locale.toUpperCase()}</span>
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-150 group-data-[state=open]:rotate-180" />
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0" align="center">
        <Command shouldFilter>
          <CommandInput
            placeholder={t("language_select__search_placeholder")}
          />
          <CommandList>
            <CommandEmpty>{t("language_select__empty")}</CommandEmpty>
            {locales.map((code) => (
              <LanguageOption
                key={code}
                code={code}
                label={formatNativeLanguageName(code)}
                isActive={code === locale}
                onSelect={handleSelect}
              />
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
