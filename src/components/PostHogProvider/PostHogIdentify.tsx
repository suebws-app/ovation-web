"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { useSession } from "@/lib/auth/client";

export const PostHogIdentify = () => {
  const { data: session, isPending } = useSession();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (isPending) return;

    const user = session?.user;

    if (user) {
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
  }, [session, isPending]);

  return null;
};
