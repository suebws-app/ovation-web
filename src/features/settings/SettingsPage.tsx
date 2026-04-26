import { redirect } from "next/navigation";
import { eventsApi } from "@/lib/api/events";
import { getCurrentUser } from "@/lib/auth/session";
import { SettingsClient } from "./SettingsClient";

export const SettingsPage = async () => {
  const [user, eventsPage] = await Promise.all([
    getCurrentUser(),
    eventsApi.list({ limit: 1 }),
  ]);
  if (!user) redirect("/sign-in");
  const event = eventsPage.items[0] ?? null;

  return <SettingsClient user={user} event={event} />;
};
