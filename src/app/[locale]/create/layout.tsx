import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import { CreateHeader } from "@/features/layout/CreateHeader/CreateHeader";
import { AppLayout } from "@/features/layout/AppLayout/AppLayout";
import { eventsApi } from "@/lib/api/events";

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user?.accountType === "pro" && !user.planTier) {
    redirect(`${appRoutes.auth.plans}?as=pro`);
  }

  if (
    user?.accountType === "couple" &&
    user.primaryEventId &&
    user.onboardingComplete
  ) {
    redirect(appRoutes.app.root);
  }

  if (user) {
    const events = await eventsApi.list({ limit: 10 }).catch(() => {
      return { items: [], nextCursor: null };
    });
    return (
      <AppLayout
        user={user}
        events={events.items}
        showSubscriptionAlert={false}
      >
        {children}
      </AppLayout>
    );
  }

  return (
    <div className="bg-background flex min-h-screen w-full flex-col">
      <CreateHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
