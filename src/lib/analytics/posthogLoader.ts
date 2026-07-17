import type { PostHog } from "posthog-js";
import { clientEnv } from "@/lib/utils/env.client";

let loadPromise: Promise<PostHog | null> | null = null;

export const loadPostHog = (): Promise<PostHog | null> => {
  if (!clientEnv.POSTHOG_KEY || typeof window === "undefined") {
    return Promise.resolve(null);
  }

  loadPromise ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(clientEnv.POSTHOG_KEY, {
      api_host: clientEnv.POSTHOG_HOST,
      defaults: "2025-05-24",
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true,
      disable_surveys: true,
      capture_dead_clicks: false,
      capture_performance: false,
      persistence: "memory",
      person_profiles: "identified_only",
      debug: !clientEnv.IS_PRODUCTION,
    });
    return posthog;
  });

  return loadPromise;
};
