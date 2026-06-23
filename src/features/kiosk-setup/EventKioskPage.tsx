import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { publicApi } from "@/lib/api/public";
import { kioskSettingsApi } from "@/lib/api/kiosk-settings";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { KioskHero } from "./components/KioskHero";
import { KioskChecklist } from "./components/KioskChecklist";
import { KioskSetupClient } from "./KioskSetupClient";

export const EventKioskPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const eventResult = await eventsApi.get(id).catch(() => null);
  const event = eventResult?.event ?? null;

  if (!event) {
    return (
      <div className={containerClassName}>
        <KioskHero slug={null} />
        <KioskChecklist />
      </div>
    );
  }

  const [publicEvent, settingsRes] = await Promise.all([
    publicApi.getEvent(event.slug).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    kioskSettingsApi.get(event.id),
  ]);

  return (
    <div className={containerClassName}>
      <KioskSetupClient
        eventId={event.id}
        slug={event.slug}
        settings={settingsRes.settings}
        publicEvent={publicEvent}
      />
    </div>
  );
};
