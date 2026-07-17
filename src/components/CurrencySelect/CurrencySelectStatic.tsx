"use client";

import { DEFAULT_CURRENCY } from "@/i18n/currency-config";
import { CurrencySelectClient } from "./CurrencySelectClient";

export const CurrencySelectStatic = () => (
  <CurrencySelectClient
    initialCurrency={DEFAULT_CURRENCY}
    reloadOnChange={false}
  />
);
