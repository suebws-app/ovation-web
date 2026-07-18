import type { PostHog } from "posthog-js";
import { clientEnv } from "@/lib/utils/env.client";
import { readAnalyticsConsent } from "./consent";
import { readRegionConsentMode } from "./region";

let loadPromise: Promise<PostHog | null> | null = null;

const canInitPostHog = (): boolean => {
  if (typeof window === "undefined") return false;
  if (readRegionConsentMode() !== "required") return true;
  return readAnalyticsConsent() === "granted";
};

export const loadPostHog = (): Promise<PostHog | null> => {
  if (!clientEnv.POSTHOG_KEY || typeof window === "undefined") {
    return Promise.resolve(null);
  }
  if (!loadPromise && !canInitPostHog()) {
    return Promise.resolve(null);
  }

  loadPromise ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(clientEnv.POSTHOG_KEY, {
      api_host: clientEnv.POSTHOG_HOST,
      defaults: "2025-05-24",
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: false,
      disable_surveys: true,
      capture_dead_clicks: false,
      capture_performance: false,
      persistence: "localStorage+cookie",
      person_profiles: "identified_only",
      debug: !clientEnv.IS_PRODUCTION,
    });
    return posthog;
  });

  return loadPromise;
};

export const getLoadedPostHog = (): Promise<PostHog | null> =>
  loadPromise ?? Promise.resolve(null);

export const enableRecordingAndCapture = async (): Promise<void> => {
  const posthog = await loadPostHog();
  if (!posthog) return;
  if (posthog.has_opted_out_capturing()) {
    posthog.opt_in_capturing({ captureEventName: null });
  }
  posthog.startSessionRecording();
};

export const disableRecordingAndCapture = async (): Promise<void> => {
  const posthog = await getLoadedPostHog();
  if (!posthog) return;
  posthog.stopSessionRecording();
  posthog.opt_out_capturing();
};
