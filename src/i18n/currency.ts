import { type Locale, localeCurrency, localeMap } from "./config";

/**
 * Format a number as currency using CLDR rules for the given locale.
 *
 * Uses the locale's default currency from our mapping and the full
 * BCP 47 tag so Intl.NumberFormat applies the correct grouping
 * separators, decimal marks, and currency symbol placement.
 *
 * @example
 * formatCurrency(49.99, "nl") // "€ 49,99"
 * formatCurrency(49.99, "de") // "49,99 €"
 * formatCurrency(49.99, "en") // "€49.99"
 */
export function formatCurrency(
  amount: number,
  locale: Locale,
  currencyOverride?: string,
): string {
  const currency = currencyOverride ?? localeCurrency[locale];
  const bcp47 = localeMap[locale];

  return new Intl.NumberFormat(bcp47, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Get currency parts for custom rendering (e.g., large price displays
 * where you want the integer and fraction styled differently).
 */
export function formatCurrencyParts(
  amount: number,
  locale: Locale,
  currencyOverride?: string,
): Intl.NumberFormatPart[] {
  const currency = currencyOverride ?? localeCurrency[locale];
  const bcp47 = localeMap[locale];

  return new Intl.NumberFormat(bcp47, {
    style: "currency",
    currency,
  }).formatToParts(amount);
}
