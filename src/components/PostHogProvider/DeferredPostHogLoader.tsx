"use client";

import { useEffect } from "react";
import { loadPostHog } from "@/lib/analytics/posthogLoader";

const IDLE_FALLBACK_DELAY_MS = 4000;
const INTERACTION_EVENTS: (keyof WindowEventMap)[] = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
];

export const DeferredPostHogLoader = () => {
  useEffect(() => {
    let loaded = false;
    const cleanups: (() => void)[] = [];
    const runCleanups = () => cleanups.forEach((cleanup) => cleanup());

    const load = () => {
      if (loaded) return;
      loaded = true;
      runCleanups();
      void loadPostHog();
    };

    INTERACTION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, load, { once: true, passive: true });
      cleanups.push(() => window.removeEventListener(eventName, load));
    });

    const timer = window.setTimeout(load, IDLE_FALLBACK_DELAY_MS);
    cleanups.push(() => window.clearTimeout(timer));

    return runCleanups;
  }, []);

  return null;
};
