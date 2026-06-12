import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { appRoutes } from "@/lib/routes";
import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { messagesApi } from "@/lib/api/messages";
import { ordersApi } from "@/lib/api/orders";
import { mediaApi } from "@/lib/api/media";

import { getCurrentUser } from "@/lib/auth/session";
import { toMessageRowView } from "@/features/messages/adapters";

import { DashboardBackGuard } from "./components/DashboardBackGuard";
import { StorageExpiredModal } from "./components/StorageExpiredModal";
import { QRcodeWidget } from "./components/widgets/QRcodeWidget";
import { Messages } from "./components/widgets/Messages";
import { Photos } from "./components/widgets/Photos";
import { Orders } from "./components/widgets/Orders";

type EventDashboardPageProps = {
  params: Promise<{ id: string }>;
};

export const EventDashboardPage = async ({
  params,
}: EventDashboardPageProps) => {
  const { id } = await params;
  const t = await getTranslations();
  const anonymous = t("common__anonymous");
  const user = await getCurrentUser();
  if (!user) redirect(appRoutes.auth.signIn);

  const eventResult = await eventsApi.get(id).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });
  if (!eventResult) notFound();
  const event = eventResult.event;

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
      <StorageExpiredModal
        storageExpiresAt={user.storageExpiresAt}
        planTier={user.planTier ?? null}
      />
      <div className="flex w-full flex-col gap-6 p-6">
        <div className="tablet:flex-row tablet:items-start flex flex-col gap-6">
          <div className="tablet:order-2 tablet:w-80 tablet:shrink-0 order-1 flex w-full flex-col gap-6">
            <QRcodeWidget shortUrl={qr?.shortUrl ?? `/g/${event.slug}`} />
            <div className="min-[1300px]:hidden">
              <Orders orders={ordersPage?.items ?? []} />
            </div>
          </div>
          <div className="tablet:order-1 order-2 flex min-w-0 flex-1 flex-col gap-6">
            <Messages
              eventId={event.id}
              messages={messageViews}
              totalCount={totalMessages}
            />
            <div className="flex flex-col gap-6 min-[1300px]:flex-row min-[1300px]:items-start">
              <Photos
                photos={galleryItems}
                totalCount={totalPhotos}
                hasMore={hasMorePhotos}
              />
              <div className="hidden min-w-0 flex-1 min-[1300px]:block">
                <Orders orders={ordersPage?.items ?? []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardBackGuard>
  );
};
