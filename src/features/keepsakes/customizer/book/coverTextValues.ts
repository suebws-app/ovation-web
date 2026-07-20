import type { Event } from "@/lib/api/types";

export const coupleNamesOf = (event?: Event | null): string | undefined => {
  const a = event?.partnerAName?.trim();
  const b = event?.partnerBName?.trim();
  if (a && b) return `${a} & ${b}`;
  return a || b || undefined;
};

export const formatWeddingDate = (date?: string | null): string | undefined => {
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
