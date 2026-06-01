import { eventsApi } from "@/lib/api/events";
import { linkSettingsApi } from "@/lib/api/link-settings";
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
        initialSettings={settingsRes.settings}
      />
    </div>
  );
};
