"use client";

import { useEffect } from "react";
import {
  readAnalyticsConsent,
  subscribeToConsentUpdates,
  type AnalyticsConsent,
} from "@/lib/analytics/consent";
import {
  disableRecordingAndCapture,
  enableRecordingAndCapture,
} from "@/lib/analytics/posthogLoader";
import { readRegionConsentMode } from "@/lib/analytics/region";

const IDLE_FALLBACK_MS = 4000;
const INTERACTION_EVENTS = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
] as const;

const deferEnable = (): (() => void) => {
  let fired = false;
  const cleanups: (() => void)[] = [];
  const fire = () => {
    if (fired) return;
    fired = true;
    cleanups.forEach((fn) => fn());
    void enableRecordingAndCapture();
  };
  INTERACTION_EVENTS.forEach((event) => {
    window.addEventListener(event, fire, { once: true, passive: true });
    cleanups.push(() => window.removeEventListener(event, fire));
  });
  const timer = window.setTimeout(fire, IDLE_FALLBACK_MS);
  cleanups.push(() => window.clearTimeout(timer));
  return () => cleanups.forEach((fn) => fn());
};

const applyConsent = (analytics: AnalyticsConsent): (() => void) | void => {
  const consentRequired = readRegionConsentMode() === "required";

  if (analytics === "granted") {
    void enableRecordingAndCapture();
    return;
  }
  if (analytics === "denied") {
    void disableRecordingAndCapture();
    return;
  }
  if (!consentRequired) {
    return deferEnable();
  }
};

export const ConsentListener = () => {
  useEffect(() => {
    let deferCleanup = applyConsent(readAnalyticsConsent());
    const unsub = subscribeToConsentUpdates((consent) => {
      deferCleanup?.();
      deferCleanup = applyConsent(consent);
    });
    return () => {
      deferCleanup?.();
      unsub();
    };
  }, []);

  return null;
};
