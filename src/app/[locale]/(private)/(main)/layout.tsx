import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AppLayout } from "@/features/layout/AppLayout/AppLayout";
import { eventsApi } from "@/lib/api/events";
import { appRoutes } from "@/lib/routes";
import type { Event } from "@/lib/api/types";

export default async function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(appRoutes.auth.signIn);
  }

  let eventsList: Event[] = [];

  if (user.accountType === "pro") {
    const events = await eventsApi.list({ limit: 100 }).catch(() => null);
    eventsList = events?.items ?? [];
  } else if (user.primaryEventId) {
    const result = await eventsApi.get(user.primaryEventId).catch(() => null);
    if (result?.event) eventsList = [result.event];
  }

  return (
    <AppLayout user={user} events={eventsList}>
      {children}
    </AppLayout>
  );
}
