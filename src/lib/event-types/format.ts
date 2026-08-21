import { getEventTypeConfig } from "./registry";

/** Minimal event shape the formatters need (generic + legacy fields). */
export type EventLike = {
  eventType?: string | null;
  eventName?: string | null;
  hostAName?: string | null;
  hostBName?: string | null;
  eventDate?: string | null;
  endDate?: string | null;
  details?: Record<string, unknown> | null;
  partnerAName?: string | null;
  partnerBName?: string | null;
  weddingDate?: string | null;
};

/** The non-null host names of an event, in order. */
export const eventHostNames = (event: EventLike): string[] =>
  [event.hostAName ?? event.partnerAName, event.hostBName ?? event.partnerBName]
    .map((name) => name?.trim())
    .filter((name): name is string => Boolean(name));

/** The joined title line for an event (e.g. "Alex & Jordan"). An explicit
 * `eventName` overrides the host names. */
export const eventTitleLine = (event: EventLike): string =>
  event.eventName?.trim() || eventHostNames(event).join(" & ");

/** The primary date of an event as a raw string, if any. */
export const eventDateOf = (event: EventLike): string | null =>
  event.eventDate ?? event.weddingDate ?? null;

/** Whether an event type declares an end-date field (multi-day support). */
export const hasEndDateField = (config: {
  fields: { column?: string | null }[];
}): boolean => config.fields.some((f) => f.column === "endDate");

/**
 * The memorial life span shown on the card, e.g. "1950 – 2020". Uses only the
 * years of `bornOn`/`passedOn`; falls back to a single year if one is missing.
 */
export const memorialLifeSpan = (
  bornOn?: unknown,
  passedOn?: unknown,
): string | undefined => {
  const year = (raw: unknown): number | undefined => {
    if (typeof raw === "number") return Number.isFinite(raw) ? raw : undefined;
    if (typeof raw === "string") {
      const match = raw.match(/\d{4}/);
      return match ? Number(match[0]) : undefined;
    }
    return undefined;
  };
  const b = year(bornOn);
  const p = year(passedOn);
  if (b && p) return `${b} – ${p}`;
  return b || p ? String(b ?? p) : undefined;
};

/**
 * Whether the event renders as a real date range (multi-day type with a
 * distinct end date). Drives the time prefix ("from" for ranges, "at" for a
 * single day) so a start time next to a range isn't ambiguous.
 */
export const isDateRange = (event: EventLike): boolean => {
  const start = eventDateOf(event);
  if (!start || !event.endDate || event.endDate === start) return false;
  return hasEndDateField(getEventTypeConfig(event.eventType));
};

/**
 * Formats an event's date as a single date or a start–end range. Returns the
 * single date (via `formatOne`) when there is no end date or the end equals the
 * start. For a real range, the month/year are collapsed when shared: same month
 * and year → "1–3 August 2026"; same year, different month → "28 August – 2
 * September 2026"; different year → both full dates joined. Returns null when
 * the event has no start date.
 */
export const formatDateRange = (
  event: EventLike,
  formatOne: (raw: string) => string,
  opts?: { locale?: string; separator?: string },
): string | null => {
  const start = eventDateOf(event);
  if (!start) return null;
  // Only multi-day types (e.g. corporate) render a range. For single-day types
  // a stray/legacy end date must be ignored, never shown as "18–20".
  const supportsRange = hasEndDateField(getEventTypeConfig(event.eventType));
  if (!supportsRange || !event.endDate || event.endDate === start) {
    return formatOne(start);
  }

  const separator = opts?.separator ?? "–";
  const locale = opts?.locale ?? "en-GB";
  const startDate = new Date(start);
  const endDate = new Date(event.endDate);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return `${formatOne(start)} ${separator} ${formatOne(event.endDate)}`;
  }

  const day = (d: Date) => d.toLocaleDateString(locale, { day: "numeric" });
  const month = (d: Date) => d.toLocaleDateString(locale, { month: "long" });
  const year = (d: Date) => d.toLocaleDateString(locale, { year: "numeric" });

  const sameYear = year(startDate) === year(endDate);
  const sameMonth = sameYear && month(startDate) === month(endDate);

  if (sameMonth) {
    return `${day(startDate)}${separator}${day(endDate)} ${month(startDate)} ${year(startDate)}`;
  }
  if (sameYear) {
    return `${day(startDate)} ${month(startDate)} ${separator} ${day(endDate)} ${month(endDate)} ${year(startDate)}`;
  }
  return `${formatOne(start)} ${separator} ${formatOne(event.endDate)}`;
};

export type EventPhase = "planning" | "post_event";

/**
 * Whether an event is before ("planning") or after ("post_event") its date,
 * driving the phase-aware dashboard widget ordering. Uses the end date when
 * present (multi-day events), otherwise the primary date. Undated events are
 * treated as "planning".
 */
export const getEventPhase = (
  event: EventLike,
  now: Date = new Date(),
): EventPhase => {
  const boundary = event.endDate ?? eventDateOf(event);
  if (!boundary) return "planning";
  const parsed = new Date(`${boundary}T23:59:59`);
  if (Number.isNaN(parsed.getTime())) return "planning";
  return parsed.getTime() < now.getTime() ? "post_event" : "planning";
};

/**
 * Whether to show a countdown: the event type must allow it (`features.countdown`
 * — every type except memorial) AND the event date must still be in the future.
 * A past or undated event shows no countdown.
 */
export const showsCountdown = (
  event: EventLike,
  now: Date = new Date(),
): boolean => {
  if (!getEventTypeConfig(event.eventType).features.countdown) return false;
  const date = eventDateOf(event);
  if (!date) return false;
  const parsed = new Date(`${date}T23:59:59`);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.getTime() >= now.getTime();
};

/** Whether an event type has a second host (couple/parents), config-driven. */
export const hasSecondHost = (eventType: string | null | undefined): boolean =>
  getEventTypeConfig(eventType).fields.some((f) => f.column === "hostBName");

type TitleT = (
  key: string,
  values?: Record<string, string | number | Date>,
) => string;

/** Max characters shown on the second-tier event-word so it never overflows. */
const MAX_POSTFIX_LEN = 24;

/** Trim and cap length (with an ellipsis). Preserves the original casing. */
const capPostfix = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.length > MAX_POSTFIX_LEN
    ? `${trimmed.slice(0, MAX_POSTFIX_LEN - 1).trimEnd()}…`
    : trimmed;
};

/** Cap length then capitalize the first letter (for translated type nouns). */
const formatPostfix = (raw: string): string => {
  const capped = capPostfix(raw);
  return capped ? capped.charAt(0).toUpperCase() + capped.slice(1) : "";
};

export type InviteCardTitle = {
  /** Single-line override (a typed Event Name); rendered alone when present. */
  title?: string;
  /** First host name (top tier). */
  partnerA: string;
  /** Second host name (top tier); empty for single-host types. */
  partnerB: string;
  /** The event word rendered on a second tier below the names (e.g. "Anniversary"). */
  postfix?: string;
};

/**
 * The parts of the invitation title, composed per type as a two-tier layout:
 * host names on top (with the "&" ornament for couples) and the event word
 * below — e.g. "Alex & Jordan" / "Anniversary", "Alex" / "Birthday". Wedding
 * has no postfix (just the couple). A typed `eventName` overrides everything
 * with a single line. Single-host types never emit a second host.
 */
export const eventCardTitle = (
  t: TitleT,
  input: {
    eventType?: string | null;
    hostA?: string | null;
    hostB?: string | null;
    eventName?: string | null;
    /** For custom-noun types (`other`), the user-entered event noun. */
    customEventNoun?: string | null;
  },
): InviteCardTitle => {
  const a = input.hostA?.trim() ?? "";
  const b = input.hostB?.trim() ?? "";
  const override = input.eventName?.trim();
  const config = getEventTypeConfig(input.eventType);
  // Custom-noun types ("other") use the host column as the event name and the
  // typed noun as the tier below — a stray `eventName` must not override it.
  if (override && !config.customNoun) {
    return { title: override, partnerA: a, partnerB: "" };
  }

  // For custom-noun types (`other`), the user's typed event noun is the second
  // tier (e.g. "Reunion") — the same slot where anniversary shows "Anniversary".
  // When no noun is typed the tier is simply hidden rather than falling back to
  // the generic "event" word. Custom nouns keep the exact casing the host typed;
  // translated type nouns (e.g. "Anniversary") are capitalized.
  const postfix = config.customNoun
    ? capPostfix(input.customEventNoun?.trim() || "")
    : formatPostfix(t(`et__${config.type}__title_postfix`));
  return {
    partnerA: a,
    partnerB: hasSecondHost(config.type) ? b : "",
    postfix: postfix || undefined,
  };
};

export const ordinalAge = (n: number): string => {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  const suffix = { 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th";
  return `${n}${suffix}`;
};
