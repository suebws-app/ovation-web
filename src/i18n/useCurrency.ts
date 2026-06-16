"use client";

import { useCallback, useState } from "react";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  type Currency,
} from "./currency-config";

const writeCookieCurrency = (currency: Currency) => {
  if (typeof document === "undefined") return;
  document.cookie = `${CURRENCY_COOKIE}=${currency};path=/;max-age=31536000;samesite=lax`;
};

export const useCurrency = (initialCurrency?: Currency) => {
  const [currency, setCurrencyState] = useState<Currency>(
    initialCurrency ?? DEFAULT_CURRENCY,
  );

  const setCurrency = useCallback((next: Currency) => {
    writeCookieCurrency(next);
    setCurrencyState(next);
  }, []);

  return { currency, setCurrency };
};
