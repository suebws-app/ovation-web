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
