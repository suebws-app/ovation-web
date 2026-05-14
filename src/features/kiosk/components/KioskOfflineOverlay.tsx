"use client";

import { Offline } from "react-detect-offline";
import { useTranslations } from "next-intl";
import { env } from "@/lib/utils/env";

const POLLING_INTERVAL_MS = 5000;
const POLLING_TIMEOUT_MS = 4000;

export const KioskOfflineOverlay = () => {
  const t = useTranslations();
  const polling = {
    url: `${env.API_URL}/health`,
    interval: POLLING_INTERVAL_MS,
    timeout: POLLING_TIMEOUT_MS,
  };

  return (
    <Offline polling={polling}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="kiosk-offline-title"
        className="bg-foreground/90 fixed inset-0 z-50 flex items-center justify-center p-10 backdrop-blur-md"
      >
        <div className="rounded-20 bg-card flex max-w-md flex-col items-center gap-4 p-10 text-center shadow-lg">
          <div className="bg-destructive/15 text-destructive flex size-14 items-center justify-center rounded-full">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1 1l22 22" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <path d="M12 20h.01" />
            </svg>
          </div>
          <h2 id="kiosk-offline-title" className="type-h3 font-semibold">
            {t("kiosk__offline__title")}
          </h2>
          <p className="type-body-small text-muted-foreground">
            {t("kiosk__offline__body")}
          </p>
          <p className="type-caption text-muted-foreground">
            {t("kiosk__offline__hint")}
          </p>
        </div>
      </div>
    </Offline>
  );
};
