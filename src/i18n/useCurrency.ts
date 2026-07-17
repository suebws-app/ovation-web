"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getCookie, setCookie } from "@/lib/utils/cookies";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  isSupportedCurrency,
  type Currency,
} from "./currency-config";

const CURRENCY_COOKIE_MAX_AGE = 31536000;

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const useCurrency = (initialCurrency?: Currency) => {
  const fallback = initialCurrency ?? DEFAULT_CURRENCY;

  const currency = useSyncExternalStore(
    subscribe,
    () => {
      const fromCookie = getCookie(CURRENCY_COOKIE)?.toUpperCase();
      return isSupportedCurrency(fromCookie) ? fromCookie : fallback;
    },
    () => fallback,
  );

  const setCurrency = useCallback((next: Currency) => {
    setCookie(CURRENCY_COOKIE, next, { maxAge: CURRENCY_COOKIE_MAX_AGE });
    notifyListeners();
  }, []);

  return { currency, setCurrency };
};
