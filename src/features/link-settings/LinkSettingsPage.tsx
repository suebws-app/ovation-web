import { linkSettingsApi } from "@/lib/api/link-settings";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { LinkSettingsClient } from "./LinkSettingsClient";
import { LinkEmpty } from "./components/LinkEmpty";

export const LinkSettingsPage = async () => {
  const event = await requireFilledCoupleEvent();

  if (!event) {
    return (
      <div className="flex w-full flex-col p-6">
        <LinkEmpty />
      </div>
    );
  }

  const settingsRes = await linkSettingsApi.get(event.id);

  return (
    <div className="mx-auto w-full min-w-0 p-6">
      <LinkSettingsClient
        eventId={event.id}
        slug={event.slug}
        submissionsEnabled={event.status === "active"}
        couplePhotoUrl={event.couplePhotoUrl}
        initialSettings={settingsRes.settings}
      />
    </div>
  );
};
