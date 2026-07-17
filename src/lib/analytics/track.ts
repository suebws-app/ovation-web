import { clientEnv } from "@/lib/utils/env.client";
import { loadPostHog } from "./posthogLoader";
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
  void loadPostHog().then((posthog) => posthog?.capture(event, properties));
};
