import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { appRoutes } from "@/lib/routes";
import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { messagesApi } from "@/lib/api/messages";
import { ordersApi } from "@/lib/api/orders";
import { mediaApi } from "@/lib/api/media";
import { weddingPlannerApi } from "@/lib/api/wedding-planner";
import { daysUntil } from "@/features/wedding-planner/utils";

import { cn } from "@ovation/ui/utils/cn";
import { getCurrentUser } from "@/lib/auth/session";
import {
  containerClassName,
  stackClassName,
} from "@/lib/utils/layoutClassNames";
import { toMessageRowView } from "@/features/messages/adapters";

import { DashboardBackGuard } from "./components/DashboardBackGuard";
import { StorageExpiredModal } from "./components/StorageExpiredModal";
import { QRcodeWidget } from "./components/widgets/QRcodeWidget";
import { Messages } from "./components/widgets/Messages";
import { Photos } from "./components/widgets/Photos";
import { Orders } from "./components/widgets/Orders";
import {
  WeddingPlannerWidget,
  type WeddingPlannerWidgetSummary,
} from "./components/widgets/WeddingPlannerWidget";

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

  const [
    stats,
    recentMessages,
    qr,
    ordersPage,
    galleryPage,
    plannerTodos,
    plannerBudget,
  ] = await Promise.all([
    eventsApi.stats(event.id, { includeOwnerUploads: true }).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    messagesApi.list(event.id, { limit: 5, sort: "newest" }).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    eventsApi.qrCode(event.id, { format: "svg", size: 512 }).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    ordersApi.list({ eventId: event.id, limit: 3 }).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    mediaApi
      .gallery(event.id, {
        type: "photo",
        sort: "newest",
        limit: 100,
        includeOwnerUploads: true,
      })
      .catch((error) => {
        if (ApiError.isApiError(error) && error.status === 404) return null;
        throw error;
      }),
    weddingPlannerApi.listTodos(event.id).catch(() => ({ todos: [] })),
    weddingPlannerApi.getBudget(event.id).catch(() => ({
      budget: { totalBudget: 0, categories: [], payments: [] },
    })),
  ]);

  const messageViews = (recentMessages?.items ?? []).map((m) =>
    toMessageRowView(m, anonymous),
  );
  const totalMessages = stats?.totalMessages ?? messageViews.length;
  const galleryItems = galleryPage?.items ?? [];
  const totalPhotos = Math.max(stats?.photoCount ?? 0, galleryItems.length);
  const hasMorePhotos = Boolean(galleryPage?.nextCursor);

  const todos = plannerTodos?.todos ?? [];
  const totalTasks = todos.length;
  const doneTasks = todos.filter((todo) => todo.status === "done").length;
  const byDueDate = (
    a: { dueDate: string | null },
    b: { dueDate: string | null },
  ) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
  const nextOpen = todos
    .filter((todo) => todo.status !== "done")
    .sort(byDueDate)
    .slice(0, 3);
  const categories = plannerBudget?.budget.categories ?? [];
  const totalBudget = plannerBudget?.budget.totalBudget ?? 0;
  const spent = categories.reduce((sum, category) => sum + category.actual, 0);

  const plannerSummary: WeddingPlannerWidgetSummary = {
    weddingDate: event.weddingDate,
    daysToGo: event.weddingDate ? daysUntil(event.weddingDate) : null,
    progressPct: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0,
    doneTasks,
    totalTasks,
    nextTasks: nextOpen.map((todo) => ({
      title: todo.title,
      dueDate: todo.dueDate,
    })),
    totalBudget,
    spent,
    remaining: totalBudget - spent,
  };

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
                "min-[1300px]:flex-row min-[1300px]:items-start",
              )}
            >
              <Photos
                photos={galleryItems}
                totalCount={totalPhotos}
                hasMore={hasMorePhotos}
              />
              <div className="hidden min-w-0 flex-1 min-[1300px]:block">
                <Orders orders={ordersPage?.items ?? []} />
              </div>
            </div>
            <WeddingPlannerWidget summary={plannerSummary} />
          </div>
        </div>
      </div>
    </DashboardBackGuard>
  );
};
