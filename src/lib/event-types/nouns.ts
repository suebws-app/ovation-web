import { getEventTypeConfig } from "./registry";
import type { EventLike } from "./format";

export type EventNouns = {
  eventNoun: string;
  hostNoun: string;
  dateLabel: string;
  guestNoun: string;
};

type NounT = (key: string) => string;

/**
 * Resolve an event's type-specific nouns for copy interpolation. Shared by the
 * client `useEventCopy` and the server `getEventCopy` so both inject the same
 * `{eventNoun}`, `{hostNoun}`, `{dateLabel}`, `{guestNoun}`. For the `other`
 * type the nouns come from the event's user-entered `details`.
 */
export const resolveEventNouns = (
  event: EventLike | null | undefined,
  t: NounT,
): EventNouns => {
  const config = getEventTypeConfig(event?.eventType);
  const details = (event?.details ?? {}) as Record<string, unknown>;
  const eventNoun =
    config.customNoun && typeof details.customEventNoun === "string"
      ? details.customEventNoun
      : t(config.nounKeys.event);
  const hostNoun =
    config.customNoun && typeof details.customHostNoun === "string"
      ? details.customHostNoun
      : t(config.nounKeys.host);
  return {
    eventNoun,
    hostNoun,
    dateLabel: t(config.nounKeys.dateLabel),
    guestNoun: t(config.nounKeys.guest),
  };
};
