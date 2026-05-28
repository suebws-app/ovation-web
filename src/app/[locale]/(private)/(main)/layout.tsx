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
    console.warn("[auth-debug] (private)/(main)/layout redirecting to sign-in: user is null");
    redirect(appRoutes.auth.signIn);
  }
  console.warn("[auth-debug] (private)/(main)/layout user loaded", { userId: user.id, accountType: user.accountType });

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
