import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AppLayout } from "@/features/layout/AppLayout/AppLayout";
import { eventsApi } from "@/lib/api/events";
import { appRoutes } from "@/lib/routes";
import type { Event } from "@/lib/api/types";

const AUTH_COOKIE_NAMES = [
  "ovation.session_token",
  "ovation.session_data",
  "ovation.csrf_token",
];

export default async function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    const cookieStore = await cookies();
    for (const name of AUTH_COOKIE_NAMES) {
      if (cookieStore.get(name)) {
        cookieStore.delete(name);
      }
    }
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
