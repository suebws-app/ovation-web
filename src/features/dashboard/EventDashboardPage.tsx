import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";

import { appRoutes } from "@/lib/routes";
import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";

import { cn } from "@ovation/ui/utils/cn";
import { getCurrentUser } from "@/lib/auth/session";
import {
  containerClassName,
  stackClassName,
} from "@/lib/utils/layoutClassNames";

import { DashboardBackGuard } from "./components/DashboardBackGuard";
import { StorageExpiredModal } from "./components/StorageExpiredModal";
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

type EventDashboardPageProps = {
  params: Promise<{ id: string }>;
};

export const EventDashboardPage = async ({
  params,
}: EventDashboardPageProps) => {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(appRoutes.auth.signIn);

  const eventResult = await eventsApi.get(id).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });
  if (!eventResult) notFound();
  const event = eventResult.event;

  return (
    <DashboardBackGuard>
      <StorageExpiredModal
        storageExpiresAt={user.storageExpiresAt}
        planTier={user.planTier ?? null}
      />
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
                "min-[1300px]:flex-row min-[1300px]:items-start",
              )}
            >
              <Suspense fallback={<PhotosWidgetSkeleton />}>
                <PhotosSection eventId={event.id} />
              </Suspense>
              <div className="hidden min-w-0 flex-1 min-[1300px]:block">
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
