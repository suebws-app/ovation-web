import { defaultLocale, locales } from "@/i18n/config";

const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!rawAppUrl && process.env.NODE_ENV === "production") {
  throw new Error("NEXT_PUBLIC_APP_URL is required in production");
}

export const appUrl = (rawAppUrl ?? "http://localhost:3000").replace(/\/$/, "");

export const localizePath = (locale: string, path: string): string => {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
};

export const absoluteUrl = (path: string): string =>
  path === "/" ? appUrl : `${appUrl}${path}`;

export const localizedAbsoluteUrl = (locale: string, path: string): string =>
  absoluteUrl(localizePath(locale, path));

export const buildLanguageAlternates = (
  path: string,
): Record<string, string> => ({
  ...Object.fromEntries(
    locales.map((locale) => [locale, localizedAbsoluteUrl(locale, path)]),
  ),
  "x-default": localizedAbsoluteUrl(defaultLocale, path),
});

const OPEN_GRAPH_LOCALES: Record<string, string> = {
  en: "en_US",
  cs: "cs_CZ",
  da: "da_DK",
  de: "de_DE",
  es: "es_ES",
  et: "et_EE",
  fi: "fi_FI",
  fr: "fr_FR",
  hr: "hr_HR",
  hu: "hu_HU",
  id: "id_ID",
  it: "it_IT",
  ko: "ko_KR",
  lt: "lt_LT",
  lv: "lv_LV",
  ms: "ms_MY",
  nl: "nl_NL",
  no: "nb_NO",
  pl: "pl_PL",
  pt: "pt_PT",
  ro: "ro_RO",
  sk: "sk_SK",
  sl: "sl_SI",
  sq: "sq_AL",
  sv: "sv_SE",
  tr: "tr_TR",
  uk: "uk_UA",
};

export const openGraphLocale = (locale: string): string =>
  OPEN_GRAPH_LOCALES[locale] ?? locale;

export const openGraphAlternateLocales = (locale: string): string[] =>
  locales
    .filter((candidate) => candidate !== locale)
    .map((candidate) => openGraphLocale(candidate));
