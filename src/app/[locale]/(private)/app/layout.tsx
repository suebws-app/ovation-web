import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AppLayout } from "@/features/layout/AppLayout/AppLayout";
import { eventsApi } from "@/lib/api/events";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { ApiError } from "@/lib/api/client";
import { appRoutes } from "@/lib/routes";

export default async function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(appRoutes.auth.signIn);
  }

  const eventsLimit = user.accountType === "pro" ? 100 : 1;
  const events = await eventsApi.list({ limit: eventsLimit }).catch(() => null);
  const eventsList = events?.items ?? [];
  const event = eventsList[0] ?? null;
  const subResult = event
    ? await subscriptionsApi.get(event.id).catch((error) => {
        if (ApiError.isApiError(error) && error.status === 404) return null;
        return null;
      })
    : null;
  const subscription = subResult?.subscription ?? null;

  return (
    <AppLayout user={user} subscription={subscription} events={eventsList}>
      {children}
    </AppLayout>
  );
}
