"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { resolveEventNouns } from "./nouns";
import type { EventLike } from "./format";

/**
 * Wraps next-intl's `useTranslations` and injects the event's type-specific
 * nouns so generic copy can interpolate `{eventNoun}`, `{hostNoun}`,
 * `{dateLabel}`, and `{guestNoun}` without every caller resolving them. See the
 * server-side counterpart `getEventCopy`.
 */
export const useEventCopy = (event?: EventLike | null) => {
  const t = useTranslations();
  const { eventNoun, hostNoun, dateLabel, guestNoun } = resolveEventNouns(
    event,
    t,
  );

  return useCallback(
    (key: string, values?: Record<string, string | number | Date>) =>
      t(key, { eventNoun, hostNoun, dateLabel, guestNoun, ...values }),
    [t, eventNoun, hostNoun, dateLabel, guestNoun],
  );
};
