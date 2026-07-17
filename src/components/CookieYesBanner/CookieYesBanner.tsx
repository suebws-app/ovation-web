import Script from "next/script";
import { clientEnv } from "@/lib/utils/env.client";

export const CookieYesBanner = () => {
  if (!clientEnv.COOKIEYES_ID) return null;

  return (
    <Script
      id="cookieyes"
      src={`https://cdn-cookieyes.com/client_data/${clientEnv.COOKIEYES_ID}/script.js`}
      strategy="afterInteractive"
    />
  );
};
