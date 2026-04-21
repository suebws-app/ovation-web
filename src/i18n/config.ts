export const locales = ["en", "fr", "nl", "de", "es", "it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/**
 * CLDR-based locale-to-currency mapping.
 * Used by the formatter to show the right currency per locale.
 * All current target markets use EUR except en which defaults to EUR
 * but can be overridden to USD/GBP based on geo-detection later.
 */
export const localeCurrency: Record<Locale, string> = {
  en: "EUR",
  fr: "EUR",
  nl: "EUR",
  de: "EUR",
  es: "EUR",
  it: "EUR",
};

/**
 * Full CLDR locale tags for Intl APIs that need region specificity.
 * next-intl uses the short codes for routing, but Intl.NumberFormat
 * and Intl.DateTimeFormat benefit from the full BCP 47 tag.
 */
export const localeMap: Record<Locale, string> = {
  en: "en-GB",
  fr: "fr-FR",
  nl: "nl-NL",
  de: "de-DE",
  es: "es-ES",
  it: "it-IT",
};
