import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import { appRoutes } from "@/lib/routes";
import { eventsApi } from "@/lib/api/events";

import { cn } from "@ovation/ui/utils/cn";
import { getCurrentUser } from "@/lib/auth/session";
import { getCurrentEvent } from "@/lib/auth/current-event";
import {
  containerClassName,
  stackClassName,
} from "@/lib/utils/layoutClassNames";

import { DashboardEmpty } from "./components/DashboardEmpty";
import { DashboardPlaceholderCTA } from "./components/DashboardPlaceholderCTA";
import { DashboardBackGuard } from "./components/DashboardBackGuard";
import { StorageExpiredModal } from "./components/StorageExpiredModal";
import { DreReturnHandler } from "./components/DreReturnHandler";
import { InvitationWidget } from "./components/widgets/InvitationWidget";
import { ReferralWidget } from "./components/widgets/ReferralWidget";
import {
  MessagesWidgetSkeleton,
  OrdersWidgetSkeleton,
  PhotosWidgetSkeleton,
  QRWidgetSkeleton,
  WeddingPlannerWidgetSkeleton,
} from "./skeletons/DashboardSkeleton";
import { MessagesSection } from "./sections/MessagesSection";
import { PhotosSection } from "./sections/PhotosSection";
import { OrdersSection } from "./sections/OrdersSection";
import { PlannerSection } from "./sections/PlannerSection";
import { QRSection } from "./sections/QRSection";

export const DashboardPage = async () => {
  const t = await getTranslations();
  const anonymous = t("common__anonymous");
  const user = await getCurrentUser();
  if (!user) redirect(appRoutes.auth.signIn);
  if (user.accountType === "pro") {
    const proEventsPage = await eventsApi.list({ limit: 100 });
    const cookieStore = await cookies();
    const lastEventId = cookieStore.get("ovation_last_event_id")?.value;
    const target = lastEventId
      ? proEventsPage.items.find((e) => e.id === lastEventId)
      : null;
    const fallback = proEventsPage.items[0];
    if (target) redirect(appRoutes.app.event(target.id));
    if (fallback) redirect(appRoutes.app.event(fallback.id));
    redirect(appRoutes.app.events);
  }
  const event = await getCurrentEvent();
  const firstName = user.fullName?.trim().split(/\s+/)[0] ?? anonymous;

  const expiredModal = (
    <StorageExpiredModal
      storageExpiresAt={user.storageExpiresAt}
      planTier={user.planTier ?? null}
    />
  );
  const dreReturnHandler = <DreReturnHandler />;

  if (!event) {
    return (
      <DashboardBackGuard>
        {expiredModal}
        {dreReturnHandler}
        <div className={containerClassName}>
          <DashboardEmpty name={firstName} />
        </div>
      </DashboardBackGuard>
    );
  }

  if (!user.onboardingComplete) {
    return (
      <DashboardBackGuard>
        {expiredModal}
        {dreReturnHandler}
        <div className={containerClassName}>
          <DashboardPlaceholderCTA name={firstName} />
        </div>
      </DashboardBackGuard>
    );
  }

  const referralSenderName = user.fullName?.trim().split(/\s+/)[0] ?? anonymous;

  return (
    <DashboardBackGuard>
      {expiredModal}
      <div className={containerClassName}>
        <div
          className={cn(stackClassName, "tablet:flex-row tablet:items-start")}
        >
          <div
            className={cn(
              stackClassName,
              "tablet:order-2 tablet:w-80 tablet:shrink-0 order-1 w-full",
            )}
          >
            <Suspense fallback={<QRWidgetSkeleton />}>
              <QRSection eventId={event.id} fallbackSlug={event.slug} />
            </Suspense>
            <InvitationWidget event={event} />
            <ReferralWidget senderName={referralSenderName} />
            <div className="min-[1300px]:hidden">
              <Suspense fallback={<OrdersWidgetSkeleton />}>
                <OrdersSection eventId={event.id} />
              </Suspense>
            </div>
          </div>
          <div
            className={cn(
              stackClassName,
              "tablet:order-1 order-2 min-w-0 flex-1",
            )}
          >
            <Suspense fallback={<MessagesWidgetSkeleton />}>
              <MessagesSection eventId={event.id} />
            </Suspense>
            <div
              className={cn(
                stackClassName,
                "min-[1300px]:flex-row min-[1300px]:items-stretch",
              )}
            >
              <Suspense fallback={<PhotosWidgetSkeleton />}>
                <PhotosSection eventId={event.id} />
              </Suspense>
              <div className="hidden w-80 shrink-0 min-[1300px]:block">
                <Suspense fallback={<OrdersWidgetSkeleton />}>
                  <OrdersSection eventId={event.id} />
                </Suspense>
              </div>
            </div>
            <Suspense fallback={<WeddingPlannerWidgetSkeleton />}>
              <PlannerSection event={event} />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardBackGuard>
  );
};
