import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { eventsApi } from "@/lib/api/events";
import { appRoutes } from "@/lib/routes";
import type { Event } from "@/lib/api/types";

export const requireFilledCoupleEvent = cache(
  async (): Promise<Event | null> => {
    const user = await getCurrentUser();
    if (!user) return null;
    if (user.accountType !== "couple") {
      const events = await eventsApi.list({ limit: 1 }).catch(() => null);
      return events?.items[0] ?? null;
    }
    const events = await eventsApi.list({ limit: 1 }).catch(() => null);
    const event = events?.items[0];
    if (!event) return null;
    if (event.kind === "empty") {
      redirect(appRoutes.app.root);
    }
    return event;
  },
);
