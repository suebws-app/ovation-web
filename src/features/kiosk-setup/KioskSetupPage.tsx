import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { publicApi } from "@/lib/api/public";
import { KioskChecklist } from "./components/KioskChecklist";
import { KioskConfigGrid } from "./components/KioskConfigGrid";
import { KioskFooter } from "./components/KioskFooter";
import { KioskHero } from "./components/KioskHero";
import { KioskPreview } from "./components/KioskPreview";

export const KioskSetupPage = async () => {
  const events = await eventsApi.list({ limit: 1 });
  const event = events.items[0] ?? null;

  const publicEvent = event
    ? await publicApi.getEvent(event.slug).catch((error) => {
        if (ApiError.isApiError(error) && error.status === 404) return null;
        throw error;
      })
    : null;

  return (
    <div className="flex flex-col gap-6">
      <KioskHero slug={event?.slug ?? null} />
      <KioskChecklist />
      <KioskConfigGrid />
      <KioskPreview slug={event?.slug ?? null} event={publicEvent} />
      <KioskFooter />
    </div>
  );
};
