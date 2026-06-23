import { linkSettingsApi } from "@/lib/api/link-settings";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { LinkSettingsClient } from "./LinkSettingsClient";
import { LinkEmpty } from "./components/LinkEmpty";

export const LinkSettingsPage = async () => {
  const event = await requireFilledCoupleEvent();

  if (!event) {
    return (
      <div className={containerClassName}>
        <LinkEmpty />
      </div>
    );
  }

  const settingsRes = await linkSettingsApi.get(event.id);

  return (
    <div className={containerClassName}>
      <LinkSettingsClient
        eventId={event.id}
        submissionsEnabled={event.status === "active"}
        couplePhotoUrl={event.couplePhotoUrl}
        initialSettings={settingsRes.settings}
      />
    </div>
  );
};
