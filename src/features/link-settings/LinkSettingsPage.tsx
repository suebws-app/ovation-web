import { eventsApi } from "@/lib/api/events";
import { linkSettingsApi } from "@/lib/api/link-settings";
import { LinkSettingsClient } from "./LinkSettingsClient";
import { LinkEmpty } from "./components/LinkEmpty";

export const LinkSettingsPage = async () => {
  const events = await eventsApi.list({ limit: 1 });
  const event = events.items[0] ?? null;

  if (!event) {
    return (
      <div className="flex h-full w-full flex-1 flex-col overflow-y-auto p-6">
        <LinkEmpty />
      </div>
    );
  }

  const settingsRes = await linkSettingsApi.get(event.id);

  return (
    <div className="mx-auto h-full w-full min-w-0 flex-1 overflow-y-auto p-6">
      <LinkSettingsClient
        eventId={event.id}
        slug={event.slug}
        submissionsEnabled={event.status === "active"}
        initialSettings={settingsRes.settings}
      />
    </div>
  );
};
