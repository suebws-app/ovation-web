import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import { SignupThemeScope } from "@/components/SignupThemeScope";
import { CreateHeader } from "@/features/layout/CreateHeader/CreateHeader";
import { AppLayout } from "@/features/layout/AppLayout/AppLayout";
import { eventsApi } from "@/lib/api/events";
import { isConsumerRole } from "@/lib/auth/account-role";
import { isPaidPlan } from "@/lib/utils/plan";

export const metadata: Metadata = { robots: { index: false } };

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (
    isConsumerRole(user?.accountType) &&
    user?.primaryEventId &&
    user.onboardingComplete
  ) {
    redirect(appRoutes.app.root);
  }

  if (user) {
    const events = await eventsApi.list({ limit: 10 }).catch(() => {
      return { items: [], nextCursor: null };
    });

    // A pro on the free tier gets exactly one event (the API enforces the same
    // limit); only send them to the plans page once that one is used up.
    if (
      user.accountType === "pro" &&
      !isPaidPlan(user.planTier) &&
      events.items.length > 0
    ) {
      redirect(`${appRoutes.auth.plans}?as=pro`);
    }

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
      <SignupThemeScope />
      <div className="bg-background flex min-h-screen w-full flex-col">
        <CreateHeader />
        <main className="flex-1">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
