import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getCurrentEvent } from "@/lib/auth/current-event";
import { appRoutes } from "@/lib/routes";
import type { Event } from "@/lib/api/types";

export const requireFilledCoupleEvent = cache(
  async (): Promise<Event | null> => {
    const user = await getCurrentUser();
    if (!user) return null;
    if (user.accountType !== "couple") {
      return getCurrentEvent();
    }
    if (!user.onboardingComplete) {
      redirect(appRoutes.app.root);
    }
    const event = await getCurrentEvent();
    return event;
  },
);
