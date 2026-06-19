import type { Event } from "@/lib/api/types";

export const coupleNameOf = (
  partnerA: string | null | undefined,
  partnerB: string | null | undefined,
): string => [partnerA, partnerB].filter(Boolean).join(" & ");

export const eventLabel = (event: Event, fallback: string): string => {
  const a = event.partnerAName?.trim();
  const b = event.partnerBName?.trim();
  if (a && b) return `${a} & ${b}`;
  if (a || b) return a || b || fallback;
  return event.slug || fallback;
};
