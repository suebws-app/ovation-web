import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AppLayout } from "@/features/layout/AppLayout/AppLayout";
import { eventsApi } from "@/lib/api/events";
import { ACTIVATING_COOKIE_NAME } from "@/features/checkout/useOptimisticPlanStore";
import type { Event } from "@/lib/api/types";

export default async function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/api/session/clear");
  }

  let eventsList: Event[] = [];

  if (user.accountType === "pro") {
    const events = await eventsApi.list({ limit: 100 }).catch(() => null);
    eventsList = events?.items ?? [];
  } else if (user.primaryEventId) {
    const result = await eventsApi.get(user.primaryEventId).catch(() => null);
    if (result?.event) eventsList = [result.event];
  }

  const cookieStore = await cookies();
  const planActivating = !!cookieStore.get(ACTIVATING_COOKIE_NAME);

  return (
    <AppLayout user={user} events={eventsList} planActivating={planActivating}>
      {children}
    </AppLayout>
  );
}
