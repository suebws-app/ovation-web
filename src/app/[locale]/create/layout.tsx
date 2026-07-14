import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import { CreateHeader } from "@/features/layout/CreateHeader/CreateHeader";
import { AppLayout } from "@/features/layout/AppLayout/AppLayout";
import { eventsApi } from "@/lib/api/events";

export const metadata: Metadata = { robots: { index: false } };

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (
    user?.accountType === "pro" &&
    (!user.planTier || user.planTier === "free")
  ) {
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
      <NextIntlClientProvider>
        <AppLayout
          user={user}
          events={events.items}
          showSubscriptionAlert={false}
        >
          {children}
        </AppLayout>
      </NextIntlClientProvider>
    );
  }

  return (
    <NextIntlClientProvider>
      <div className="bg-background flex min-h-screen w-full flex-col">
        <CreateHeader />
        <main className="flex-1">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
