"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { eventsClient } from "@/lib/api/events-client";
import { profileClient } from "@/lib/api/profile-client";
import type { UpdateEventInput } from "@/lib/api/types";
import {
  clearPendingEvent,
  readPendingEvent,
} from "@/features/create/pendingEvent";
import { isConsumerRole } from "@/lib/auth/account-role";

const SLUG_RE = /^[a-z0-9-]{4,20}$/;

type EnsureHostEventProps = {
  accountType: string;
  hasEvent: boolean;
};

/**
 * Safety net for the signup gap: when email verification is on, the event is
 * not created at signup and the host auto-signs-in straight to the dashboard.
 * If a host lands here with no event but pending wizard data was durably
 * stashed (see pendingEvent.ts), create the event now, mark onboarding, and
 * refresh so the real dashboard renders.
 */
export const EnsureHostEvent = ({
  accountType,
  hasEvent,
}: EnsureHostEventProps) => {
  const router = useRouter();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    if (!isConsumerRole(accountType) || hasEvent) return;
    const pending = readPendingEvent();
    if (!pending) return;
    startedRef.current = true;

    const run = async () => {
      try {
        const { desiredSlug, themeColor, ...input } = pending;
        const { event } = await eventsClient.create(input);
        const updates: UpdateEventInput = {};
        if (
          desiredSlug &&
          desiredSlug !== event.slug &&
          SLUG_RE.test(desiredSlug)
        ) {
          updates.slug = desiredSlug;
        }
        if (themeColor) updates.themeColor = themeColor;
        if (Object.keys(updates).length > 0) {
          await eventsClient.update(event.id, updates).catch(() => undefined);
        }
        await profileClient.markOnboardingComplete().catch(() => undefined);
        clearPendingEvent();
        router.refresh();
      } catch (error) {
        // Leave the stash in place so a later attempt can use it, but surface
        // the failure so it isn't silently lost.
        console.error("[EnsureHostEvent] failed to create event", error);
        startedRef.current = false;
      }
    };

    run();
  }, [accountType, hasEvent, router]);

  return null;
};
