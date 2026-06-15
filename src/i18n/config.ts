const ALL_LOCALES = [
  "en",
  "es",
  "pt",
  "it",
  "de",
  "id",
  "ms",
  "tr",
  "nl",
  "no",
  "th",
  "da",
  "fi",
  "ko",
  "pl",
  "ro",
  "hu",
  "lt",
  "lv",
  "et",
  "el",
  "sk",
  "sl",
  "hr",
  "cs",
  "vi",
  "uk",
  "sv",
  "fr",
  "fil",
] as const;

export type Locale = (typeof ALL_LOCALES)[number];

const FALLBACK_LOCALE: Locale = "en";

const parseEnabledLocales = (): readonly Locale[] => {
  const raw = process.env.NEXT_ALLOWED_LOCALIZATION;
  if (!raw) return [FALLBACK_LOCALE];

  const requested = new Set(
    raw
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean),
  );

  const enabled = ALL_LOCALES.filter((locale) => requested.has(locale));
  return enabled.length > 0 ? enabled : [FALLBACK_LOCALE];
};

export const locales = parseEnabledLocales();
export const defaultLocale: Locale = locales[0] ?? FALLBACK_LOCALE;
