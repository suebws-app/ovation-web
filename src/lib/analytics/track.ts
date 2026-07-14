import posthog from "posthog-js";
import { clientEnv } from "@/lib/utils/env.client";
import type { AnalyticsEventMap, AnalyticsEventName } from "./events";

type TrackArgs<E extends AnalyticsEventName> =
  Partial<AnalyticsEventMap[E]> extends AnalyticsEventMap[E]
    ? [properties?: AnalyticsEventMap[E]]
    : [properties: AnalyticsEventMap[E]];

export const trackEvent = <E extends AnalyticsEventName>(
  event: E,
  ...[properties]: TrackArgs<E>
): void => {
  if (!clientEnv.POSTHOG_KEY || typeof window === "undefined") return;
  posthog.capture(event, properties);
};
