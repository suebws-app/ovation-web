import { locales } from "@/i18n/config";

const VISIBLE_LANGUAGE_COUNT = 6;

const toNativeLanguageName = (locale: string) => {
  const name =
    new Intl.DisplayNames([locale], { type: "language" }).of(locale) ?? locale;
  return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
};

export const TOTAL_LANGUAGE_COUNT = locales.length;

export const VISIBLE_LANGUAGES = locales
  .slice(0, VISIBLE_LANGUAGE_COUNT)
  .map(toNativeLanguageName);

export const REMAINING_LANGUAGE_COUNT = Math.max(
  TOTAL_LANGUAGE_COUNT - VISIBLE_LANGUAGE_COUNT,
  0,
);
