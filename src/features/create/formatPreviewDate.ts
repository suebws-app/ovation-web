import { getEventTypeConfig, hasEndDateField } from "@/lib/event-types";

const opts = { day: "numeric", month: "short", year: "numeric" } as const;
const full = (d: Date) => d.toLocaleDateString("en-GB", opts);
const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric" });
const month = (d: Date) => d.toLocaleDateString("en-GB", { month: "short" });
const year = (d: Date) => d.toLocaleDateString("en-GB", { year: "numeric" });

/**
 * The date shown on the create-wizard book/cover preview. Multi-day types
 * (corporate) render a start–end range (collapsed like the invite card);
 * single-day types show one date. Mirrors `formatDateRange`.
 */
export const formatPreviewDate = (
  start: Date | null,
  end: Date | null,
  eventType?: string | null,
): string | undefined => {
  if (!start || Number.isNaN(start.getTime())) return undefined;
  const supportsRange = hasEndDateField(getEventTypeConfig(eventType));
  if (
    !supportsRange ||
    !end ||
    Number.isNaN(end.getTime()) ||
    end.getTime() === start.getTime()
  ) {
    return full(start);
  }
  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()
  ) {
    return `${day(start)}–${day(end)} ${month(start)} ${year(start)}`;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${day(start)} ${month(start)} – ${day(end)} ${month(end)} ${year(start)}`;
  }
  return `${full(start)} – ${full(end)}`;
};
