import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { PrivateLayout } from "@/features/layout/PrivateLayout/PrivateLayout";
import { eventsApi } from "@/lib/api/events";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { ApiError } from "@/lib/api/client";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const events = await eventsApi.list({ limit: 1 }).catch(() => null);
  const event = events?.items[0] ?? null;
  const subResult = event
    ? await subscriptionsApi.get(event.id).catch((error) => {
        if (ApiError.isApiError(error) && error.status === 404) return null;
        return null;
      })
    : null;
  const subscription = subResult?.subscription ?? null;

  return (
    <PrivateLayout user={user} subscription={subscription}>
      {children}
    </PrivateLayout>
  );
}
