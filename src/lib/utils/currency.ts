const EXACT_PRICE_CURRENCIES = new Set<string>([
  "JPY",
  "KRW",
  "ISK",
  "CLP",
  "VND",
  "UGX",
  "RWF",
  "KMF",
  "DJF",
  "XAF",
  "XOF",
  "XPF",
]);

export const isExactPriceCurrency = (currency: string): boolean =>
  EXACT_PRICE_CURRENCIES.has(currency.toUpperCase());

export const toDisplayAmount = (amount: number, currency: string): number =>
  isExactPriceCurrency(currency) ? amount : amount / 100;

const buildFormatter = (currency: string, locale: string): Intl.NumberFormat =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  });

export const formatMoney = (
  amount: number,
  currency: string,
  locale?: string,
): string => {
  try {
    return buildFormatter(currency, locale ?? "en").format(
      toDisplayAmount(amount, currency),
    );
  } catch {
    return `${toDisplayAmount(amount, currency).toFixed(
      isExactPriceCurrency(currency) ? 0 : 2,
    )} ${currency}`;
  }
};

export const currencySymbol = (currency: string, locale = "en"): string => {
  try {
    const parts = buildFormatter(currency, locale).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? currency;
  } catch {
    return currency;
  }
};

export const buildCurrencyLabel = (
  currency: string,
  locale: string,
): string => {
  const symbol = currencySymbol(currency, locale);
  return symbol === currency ? currency : `${currency} ${symbol}`;
};
