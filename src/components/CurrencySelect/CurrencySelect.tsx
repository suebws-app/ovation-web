import { cookies } from "next/headers";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  isSupportedCurrency,
  type Currency,
} from "@/i18n/currency-config";
import { CurrencySelectClient } from "./CurrencySelectClient";

export const CurrencySelect = async () => {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(CURRENCY_COOKIE)?.value?.toUpperCase();
  const initialCurrency: Currency = isSupportedCurrency(fromCookie)
    ? fromCookie
    : DEFAULT_CURRENCY;

  return <CurrencySelectClient initialCurrency={initialCurrency} />;
};
