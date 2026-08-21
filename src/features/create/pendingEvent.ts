import type { CreateEventInput } from "@/lib/api/types";

/**
 * A durable (no-TTL, cross-tab) stash of the wizard's event data, written when
 * a logged-out host leaves the create wizard for signup. Unlike the create
 * store (5-min TTL, and lost across the email-verification tab), this survives
 * the round-trip so the event can be reliably created once the host lands
 * authenticated on the dashboard (see EnsureHostEvent).
 */
const KEY = "ovation_pending_event";

export type PendingEvent = CreateEventInput & {
  desiredSlug?: string;
  // Applied via a follow-up `update` after create — the create endpoint does
  // not accept `themeColor`.
  themeColor?: string;
};

export const stashPendingEvent = (data: PendingEvent): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — non-fatal
  }
};

export const readPendingEvent = (): PendingEvent | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PendingEvent) : null;
  } catch {
    return null;
  }
};

export const clearPendingEvent = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // non-fatal
  }
};
