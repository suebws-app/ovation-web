import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AppLayout } from "@/features/layout/AppLayout/AppLayout";
import { eventsApi } from "@/lib/api/events";
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

  return (
    <AppLayout user={user} events={eventsList}>
      {children}
    </AppLayout>
  );
}
