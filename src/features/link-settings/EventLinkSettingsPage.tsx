import { eventsApi } from "@/lib/api/events";
import { linkSettingsApi } from "@/lib/api/link-settings";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { LinkSettingsClient } from "./LinkSettingsClient";
import { LinkEmpty } from "./components/LinkEmpty";

export const EventLinkSettingsPage = async ({
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
        <LinkEmpty />
      </div>
    );
  }

  const settingsRes = await linkSettingsApi.get(event.id);

  return (
    <div className={containerClassName}>
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
