import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { eventsApi } from "@/lib/api/events";
import { appRoutes } from "@/lib/routes";

export default async function CreateEventGuardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user?.accountType === "pro" && !user.planTier) {
    redirect(`${appRoutes.auth.signUpPlan}?as=pro`);
  }
  if (user?.accountType === "couple") {
    const existing = await eventsApi.list({ limit: 1 }).catch(() => null);
    const event = existing?.items[0];
    if (event) {
      redirect(appRoutes.app.event(event.id));
    }
  }
  return <>{children}</>;
}
