import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getCurrentEvent } from "@/lib/auth/current-event";
import { appRoutes } from "@/lib/routes";
import { SettingsProfileSection } from "./components/SettingsProfileSection";

export const SettingsProfilePage = async () => {
  const [user, event] = await Promise.all([
    getCurrentUser(),
    getCurrentEvent(),
  ]);
  if (!user) redirect(appRoutes.auth.signIn);

  return <SettingsProfileSection user={user} event={event} />;
};
