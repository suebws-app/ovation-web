"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { isLocale } from "@/lib/utils/isLocale";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SEGMENT_KEY: Record<string, string> = {
  home: "sidebar__nav__home",
  messages: "sidebar__nav__messages",
  photos: "sidebar__nav__photos",
  shop: "sidebar__nav__keepsakes",
  keepsakes: "sidebar__nav__keepsakes",
  orders: "sidebar__nav__orders",
  guests: "sidebar__nav__guests",
  settings: "sidebar__nav__settings",
  "qr-code": "sidebar__quick__qr",
  link: "sidebar__quick__link",
  cart: "cart__items__title",
  account: "account__title",
};

const titleCase = (segment: string): string =>
  segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const usePageTitle = (): string => {
  const t = useTranslations();
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((s) => !isLocale(s))
    .filter((s) => !UUID_RE.test(s));

  for (let i = segments.length - 1; i >= 0; i--) {
    const key = SEGMENT_KEY[segments[i]];
    if (key) return t(key);
  }

  const last = segments[segments.length - 1];
  return last ? titleCase(last) : "";
};
