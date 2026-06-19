"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@ovation/ui/components/MultiSelect";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { formatNativeLanguageName } from "@/lib/utils/localeFormatters";

const CORE_LANGUAGES: readonly Locale[] = ["en", "de", "fr", "es"] as Locale[];

const resolveBrowserLocale = (): Locale | null => {
  if (typeof navigator === "undefined") return null;
  const candidates = [navigator.language, ...(navigator.languages ?? [])];
  for (const tag of candidates) {
    if (!tag) continue;
    const lower = tag.toLowerCase();
    const base = lower.split("-")[0];
    const match = locales.find(
      (l) => l.toLowerCase() === lower || l.toLowerCase() === base,
    );
    if (match) return match;
  }
  return null;
};

type KioskLanguagesSelectProps = {
  defaultLanguage: string;
  supportedLanguages: string[];
  onChange: (next: {
    defaultLanguage?: Locale;
    supportedLanguages?: Locale[];
  }) => void;
};

export const KioskLanguagesSelect = ({
  defaultLanguage,
  supportedLanguages,
  onChange,
}: KioskLanguagesSelectProps) => {
  const t = useTranslations();
  const userLocale = useLocale() as Locale;
  const hasInitializedRef = useRef(false);

  const sortedOptions = useMemo<MultiSelectOption<Locale>[]>(
    () =>
      [...locales]
        .sort((a, b) =>
          formatNativeLanguageName(a).localeCompare(
            formatNativeLanguageName(b),
          ),
        )
        .map((locale) => ({
          value: locale,
          label: formatNativeLanguageName(locale),
          keywords: [locale],
        })),
    [],
  );

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const preferred =
      (locales.includes(userLocale) ? userLocale : null) ??
      resolveBrowserLocale();

    const isEmpty = supportedLanguages.length === 0;
    const alreadyHasPreferred =
      !preferred || supportedLanguages.includes(preferred);

    if (!isEmpty && alreadyHasPreferred) return;

    const seeded = new Set<Locale>(supportedLanguages as Locale[]);
    if (isEmpty) {
      CORE_LANGUAGES.filter((l) => locales.includes(l)).forEach((l) =>
        seeded.add(l),
      );
    }
    if (preferred) seeded.add(preferred);
    if (seeded.size === 0) seeded.add(defaultLocale);

    const next = Array.from(seeded);
    const preferredDefault =
      preferred && next.includes(preferred) ? preferred : next[0]!;
    onChange({
      supportedLanguages: next,
      ...(isEmpty ? { defaultLanguage: preferredDefault } : {}),
    });
  }, [supportedLanguages, onChange, userLocale]);

  const handleChange = (next: Locale[]) => {
    if (next.length === 0) return;
    const nextDefault = next.includes(defaultLanguage as Locale)
      ? (defaultLanguage as Locale)
      : next[0];
    onChange({
      supportedLanguages: next,
      ...(nextDefault === defaultLanguage
        ? {}
        : { defaultLanguage: nextDefault }),
    });
  };

  return (
    <div className="py-5">
      <MultiSelect<Locale>
        value={supportedLanguages as Locale[]}
        onChange={handleChange}
        options={sortedOptions}
        placeholder={t("kiosk__config__languages__add")}
        searchPlaceholder={t("language_select__search_placeholder")}
        emptyText={t("language_select__empty")}
        ariaLabel={t("language_select__label")}
        className="w-full!"
      />
    </div>
  );
};
