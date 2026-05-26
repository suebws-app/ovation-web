import "server-only";
import { cache } from "react";
import { eventsApi } from "@/lib/api/events";
import type { Event } from "@/lib/api/types";

export const getCurrentEvent = cache(async (): Promise<Event | null> => {
  const events = await eventsApi.list({ limit: 1 }).catch(() => null);
  return events?.items[0] ?? null;
});
