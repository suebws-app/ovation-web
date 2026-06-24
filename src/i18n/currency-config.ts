/**
 * Source of truth: ECB ∩ Paddle.
 *
 * Each currency here must satisfy two conditions:
 *  - ECB publishes its daily reference rate (so we can derive prices).
 *  - Paddle supports billing in it (so checkout succeeds).
 *
 * Keep this list in lockstep with the backend `SUPPORTED_CURRENCIES` in
 * ovation-api/src/modules/currency/supported-currencies.ts. See that file's
 * JSDoc for the rationale and the list of currencies excluded from each side.
 */
const SUPPORTED_CURRENCIES = [
  "EUR",
  "USD",
  "AUD",
  "BRL",
  "CAD",
  "CHF",
  "CNY",
  "CZK",
  "DKK",
  "GBP",
  "HKD",
  "HUF",
  "ILS",
  "INR",
  "JPY",
  "KRW",
  "MXN",
  "NOK",
  "NZD",
  "PLN",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "ZAR",
] as const;

export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "EUR";
export const FALLBACK_CURRENCIES: readonly Currency[] = ["EUR", "USD", "GBP"];
export const CURRENCY_COOKIE = "NEXT_CURRENCY";

const SUPPORTED_SET = new Set<string>(SUPPORTED_CURRENCIES);

export const isSupportedCurrency = (
  value: string | null | undefined,
): value is Currency =>
  typeof value === "string" && SUPPORTED_SET.has(value.toUpperCase());
