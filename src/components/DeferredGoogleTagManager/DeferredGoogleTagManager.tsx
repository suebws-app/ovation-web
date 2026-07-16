"use client";

import { useEffect } from "react";

const IDLE_FALLBACK_DELAY_MS = 4000;
const INTERACTION_EVENTS: (keyof WindowEventMap)[] = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
];

const injectGtmScript = (gtmId: string) => {
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(script);
};

export const DeferredGoogleTagManager = ({ gtmId }: { gtmId: string }) => {
  useEffect(() => {
    let loaded = false;
    const cleanups: (() => void)[] = [];
    const runCleanups = () => cleanups.forEach((cleanup) => cleanup());

    const load = () => {
      if (loaded) return;
      loaded = true;
      runCleanups();
      injectGtmScript(gtmId);
    };

    INTERACTION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, load, { once: true, passive: true });
      cleanups.push(() => window.removeEventListener(eventName, load));
    });

    const timer = window.setTimeout(load, IDLE_FALLBACK_DELAY_MS);
    cleanups.push(() => window.clearTimeout(timer));

    return runCleanups;
  }, [gtmId]);

  return null;
};
