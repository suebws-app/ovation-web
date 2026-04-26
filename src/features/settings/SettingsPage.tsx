import { authApi } from "@/lib/api/auth";
import { eventsApi } from "@/lib/api/events";
import { SettingsClient } from "./SettingsClient";

export const SettingsPage = async () => {
  const [{ user }, eventsPage] = await Promise.all([
    authApi.me(),
    eventsApi.list({ limit: 1 }),
  ]);
  const event = eventsPage.items[0] ?? null;

  return <SettingsClient user={user} event={event} />;
};
