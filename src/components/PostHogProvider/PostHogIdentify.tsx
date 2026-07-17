"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth/client";
import { isExcludedFromAnalytics } from "@/lib/analytics/excludedEmails";
import { loadPostHog } from "@/lib/analytics/posthogLoader";

export const PostHogIdentify = () => {
  const { data: session, isPending } = useSession();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (isPending) return;

    const user = session?.user;
    if (!user && !identifiedUserId.current) return;

    void loadPostHog().then((posthog) => {
      if (!posthog) return;

      if (user) {
        if (isExcludedFromAnalytics(user.email)) {
          if (identifiedUserId.current) {
            identifiedUserId.current = null;
            posthog.reset();
          }
          posthog.opt_out_capturing();
          return;
        }

        if (posthog.has_opted_out_capturing()) {
          posthog.opt_in_capturing({ captureEventName: null });
        }

        if (identifiedUserId.current === user.id) return;
        identifiedUserId.current = user.id;
        posthog.identify(user.id, {
          email: user.email,
          name: user.name,
        });
        return;
      }

      if (identifiedUserId.current) {
        identifiedUserId.current = null;
        posthog.reset();
      }
    });
  }, [session, isPending]);

  return null;
};
