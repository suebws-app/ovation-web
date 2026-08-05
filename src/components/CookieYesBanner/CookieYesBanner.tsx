"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { clientEnv } from "@/lib/utils/env.client";

const HIDDEN_PATH_PREFIXES = ["/g", "/i"];

const COOKIEYES_SELECTORS = [
  "#cookieyes",
  "[class^='cky-']",
  "[class*=' cky-']",
  "[id^='cky-']",
];

const isPathHidden = (pathname: string) =>
  HIDDEN_PATH_PREFIXES.some((prefix) => {
    const localeStripped = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    return localeStripped === prefix || localeStripped.startsWith(`${prefix}/`);
  });

export const CookieYesBanner = () => {
  const pathname = usePathname();
  const hidden = isPathHidden(pathname);

  useEffect(() => {
    if (!hidden) return;
    document
      .querySelectorAll(COOKIEYES_SELECTORS.join(","))
      .forEach((el) => el.remove());
  }, [hidden]);

  if (!clientEnv.COOKIEYES_ID) return null;
  if (hidden) return null;

  return (
    <Script
      id="cookieyes"
      src={`https://cdn-cookieyes.com/client_data/${clientEnv.COOKIEYES_ID}/script.js`}
      strategy="lazyOnload"
    />
  );
};
