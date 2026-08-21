import { getTranslations } from "next-intl/server";
import { resolveEventNouns } from "./nouns";
import type { EventLike } from "./format";

/**
 * Server-side counterpart of `useEventCopy`. Resolves the event's type-specific
 * nouns and returns a `t(key, values)` wrapper that injects `{eventNoun}`,
 * `{hostNoun}`, `{dateLabel}`, and `{guestNoun}` into generic copy. Kept out of
 * the package barrel so `next-intl/server` never leaks into client bundles.
 */
export const getEventCopy = async (event?: EventLike | null) => {
  const t = await getTranslations();
  const nouns = resolveEventNouns(event, t);
  return (key: string, values?: Record<string, string | number | Date>) =>
    t(key, { ...nouns, ...values });
};
