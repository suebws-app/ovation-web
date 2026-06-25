import { ApiError } from "@/lib/api/client";
import { publicApi } from "@/lib/api/public";
import { kioskSettingsApi } from "@/lib/api/kiosk-settings";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { KioskHero } from "./components/KioskHero";
import { KioskChecklist } from "./components/KioskChecklist";
import { KioskSetupClient } from "./KioskSetupClient";

export const KioskSetupPage = async () => {
  const event = await requireFilledCoupleEvent();

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
