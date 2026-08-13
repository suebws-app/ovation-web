import type { Event } from "@/lib/api/types";

type EventNameParts = Pick<
  Event,
  | "eventName"
  | "hostAName"
  | "hostBName"
  | "partnerAName"
  | "partnerBName"
  | "slug"
>;

export const coupleNameOf = (
  partnerA: string | null | undefined,
  partnerB: string | null | undefined,
): string => [partnerA, partnerB].filter(Boolean).join(" & ");

export const eventDisplayName = (
  event: EventNameParts,
  fallback = "",
): string => {
  const name = event.eventName?.trim();
  if (name) return name;
  const a = (event.hostAName ?? event.partnerAName)?.trim();
  const b = (event.hostBName ?? event.partnerBName)?.trim();
  if (a && b) return `${a} & ${b}`;
  return a || b || event.slug?.trim() || fallback;
};

export const eventInitials = (event: EventNameParts): string => {
  const name = event.eventName?.trim();
  if (name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("");
  }
  const a = (event.hostAName ?? event.partnerAName)?.trim();
  const b = (event.hostBName ?? event.partnerBName)?.trim();
  return [a, b]
    .filter(Boolean)
    .map((part) => part![0]?.toUpperCase() ?? "")
    .join(" & ");
};

export const eventLabel = (event: Event, fallback: string): string =>
  eventDisplayName(event, fallback);
