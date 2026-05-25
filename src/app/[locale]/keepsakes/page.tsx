import { getCurrentUser } from "@/lib/auth/session";
import { eventsApi } from "@/lib/api/events";
import { AppLayout } from "@/features/layout/AppLayout/AppLayout";
import { KeepsakesPage } from "@/features/keepsakes/KeepsakesPage";
import { KeepsakesStorePage } from "@/features/marketing/KeepsakesStorePage";

export default async function KeepsakesRoute() {
  const user = await getCurrentUser();

  if (!user) return <KeepsakesStorePage />;

  const eventsLimit = user.accountType === "pro" ? 100 : 1;
  const events = await eventsApi.list({ limit: eventsLimit }).catch(() => null);
  const eventsList = events?.items ?? [];

  return (
    <AppLayout user={user} events={eventsList}>
      <KeepsakesPage />
    </AppLayout>
  );
}
