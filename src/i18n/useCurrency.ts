"use client";

import { useCallback, useState } from "react";
import { setCookie } from "@/lib/utils/cookies";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  type Currency,
} from "./currency-config";

const CURRENCY_COOKIE_MAX_AGE = 31536000;

export const useCurrency = (initialCurrency?: Currency) => {
  const [currency, setCurrencyState] = useState<Currency>(
    initialCurrency ?? DEFAULT_CURRENCY,
  );

  const setCurrency = useCallback((next: Currency) => {
    setCookie(CURRENCY_COOKIE, next, { maxAge: CURRENCY_COOKIE_MAX_AGE });
    setCurrencyState(next);
  }, []);

  return { currency, setCurrency };
};
