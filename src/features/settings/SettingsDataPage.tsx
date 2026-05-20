import { cookies } from "next/headers";
import { eventsApi } from "@/lib/api/events";
import { getCurrentUser } from "@/lib/auth/session";
import { SettingsDataSection } from "./components/SettingsDataSection";

const LAST_EVENT_COOKIE = "ovation_last_event_id";

export const SettingsDataPage = async () => {
  const [user, eventsPage] = await Promise.all([
    getCurrentUser(),
    eventsApi.list({ limit: 100 }),
  ]);
  const cookieStore = await cookies();
  const lastEventId = cookieStore.get(LAST_EVENT_COOKIE)?.value;
  const initialEvent =
    eventsPage.items.find((e) => e.id === lastEventId) ??
    eventsPage.items[0] ??
    null;

  return (
    <SettingsDataSection
      events={eventsPage.items}
      initialEventId={initialEvent?.id ?? null}
      isPro={user?.accountType === "pro"}
    />
  );
};
