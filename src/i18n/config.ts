const FALLBACK_LOCALE = "en";

const parseLocales = (raw: string | undefined): readonly string[] => {
  if (!raw) return [FALLBACK_LOCALE];

  const tokens = raw
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  return tokens.length > 0 ? tokens : [FALLBACK_LOCALE];
};

const ALL_LOCALES = parseLocales(process.env.NEXT_PUBLIC_ALLOWED_LOCALIZATION);

export type Locale = (typeof ALL_LOCALES)[number];

export const locales: readonly Locale[] = ALL_LOCALES;
export const defaultLocale: Locale = ALL_LOCALES[0] ?? FALLBACK_LOCALE;
