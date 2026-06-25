import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import { appRoutes } from "@/lib/routes";
import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { messagesApi } from "@/lib/api/messages";
import { ordersApi } from "@/lib/api/orders";
import { mediaApi } from "@/lib/api/media";

import { cn } from "@ovation/ui/utils/cn";
import { getCurrentUser } from "@/lib/auth/session";
import { getCurrentEvent } from "@/lib/auth/current-event";
import {
  containerClassName,
  stackClassName,
} from "@/lib/utils/layoutClassNames";
import { toMessageRowView } from "@/features/messages/adapters";

import { DashboardEmpty } from "./components/DashboardEmpty";
import { DashboardPlaceholderCTA } from "./components/DashboardPlaceholderCTA";
import { DashboardBackGuard } from "./components/DashboardBackGuard";
import { StorageExpiredModal } from "./components/StorageExpiredModal";
import { DreReturnHandler } from "./components/DreReturnHandler";
import { QRcodeWidget } from "./components/widgets/QRcodeWidget";
import { Messages } from "./components/widgets/Messages";
import { Photos } from "./components/widgets/Photos";
import { Orders } from "./components/widgets/Orders";

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
          <DashboardEmpty />
        </div>
      </DashboardBackGuard>
    );
  }

  if (!user.onboardingComplete) {
    const firstName = user.fullName?.trim().split(/\s+/)[0] ?? anonymous;
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

  const [stats, recentMessages, qr, ordersPage, galleryPage] =
    await Promise.all([
      eventsApi
        .stats(event.id, { includeOwnerUploads: true })
        .catch((error) => {
          if (ApiError.isApiError(error) && error.status === 404) return null;
          throw error;
        }),
      messagesApi
        .list(event.id, { limit: 5, sort: "newest" })
        .catch((error) => {
          if (ApiError.isApiError(error) && error.status === 404) return null;
          throw error;
        }),
      eventsApi
        .qrCode(event.id, { format: "svg", size: 512 })
        .catch((error) => {
          if (ApiError.isApiError(error) && error.status === 404) return null;
          throw error;
        }),
      ordersApi.list({ eventId: event.id, limit: 3 }).catch((error) => {
        if (ApiError.isApiError(error) && error.status === 404) return null;
        throw error;
      }),
      mediaApi
        .gallery(event.id, { type: "photo", sort: "newest", limit: 100 })
        .catch((error) => {
          if (ApiError.isApiError(error) && error.status === 404) return null;
          throw error;
        }),
    ]);

  const messageViews = (recentMessages?.items ?? []).map((m) =>
    toMessageRowView(m, anonymous),
  );
  const totalMessages = stats?.totalMessages ?? messageViews.length;
  const galleryItems = galleryPage?.items ?? [];
  const totalPhotos = Math.max(stats?.photoCount ?? 0, galleryItems.length);
  const hasMorePhotos = Boolean(galleryPage?.nextCursor);

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
            <QRcodeWidget shortUrl={qr?.shortUrl ?? `/g/${event.slug}`} />
            <div className="min-[1300px]:hidden">
              <Orders orders={ordersPage?.items ?? []} />
            </div>
          </div>
          <div
            className={cn(
              stackClassName,
              "tablet:order-1 order-2 min-w-0 flex-1",
            )}
          >
            <Messages
              eventId={event.id}
              messages={messageViews}
              totalCount={totalMessages}
            />
            <div
              className={cn(
                stackClassName,
                "min-[1300px]:flex-row min-[1300px]:items-stretch",
              )}
            >
              <Photos
                photos={galleryItems}
                totalCount={totalPhotos}
                hasMore={hasMorePhotos}
              />
              <div className="hidden w-80 shrink-0 min-[1300px]:block">
                <Orders orders={ordersPage?.items ?? []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardBackGuard>
  );
};
