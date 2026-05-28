import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getCurrentEvent } from "@/lib/auth/current-event";
import { appRoutes } from "@/lib/routes";
import { SettingsDangerSection } from "./components/SettingsDangerSection";

export const SettingsDangerPage = async () => {
  const [user, event] = await Promise.all([
    getCurrentUser(),
    getCurrentEvent(),
  ]);
  if (!user) redirect(appRoutes.auth.signIn);

  return <SettingsDangerSection user={user} event={event} />;
};
