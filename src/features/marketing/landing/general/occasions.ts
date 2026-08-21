export const OCCASION_KEYS = [
  "wed",
  "anni",
  "baby",
  "bday",
  "grad",
  "mem",
  "corp",
] as const;

export type OccasionKey = (typeof OCCASION_KEYS)[number];
