import type { Event } from "@/lib/api/types";
import { eventTitleLine } from "@/lib/event-types";

/** The event's title line (host names), event-type-agnostic. */
export const titleLineOf = (event?: Event | null): string | undefined => {
  if (!event) return undefined;
  const line = eventTitleLine(event);
  return line || undefined;
};

/** Legacy alias. */
export const coupleNamesOf = titleLineOf;

export const formatEventDate = (date?: string | null): string | undefined => {
  if (!date) return undefined;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
};

/** Legacy alias. */
export const formatWeddingDate = formatEventDate;
