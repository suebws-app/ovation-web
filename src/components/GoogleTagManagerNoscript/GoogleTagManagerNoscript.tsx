import { clientEnv } from "@/lib/utils/env.client";

export const GoogleTagManagerNoscript = () => {
  if (!clientEnv.GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${clientEnv.GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
};
