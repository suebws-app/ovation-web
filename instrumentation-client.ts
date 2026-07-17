import type { captureRouterTransitionStart } from "@sentry/nextjs";
import {
  scheduleSentryLoad,
  trackRouterTransition,
} from "@/lib/observability/sentry";

scheduleSentryLoad();

export const onRouterTransitionStart: typeof captureRouterTransitionStart = (
  href,
  navigationType,
) => {
  trackRouterTransition(href, navigationType);
};
