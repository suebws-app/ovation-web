import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { weddingPlannerApi } from "@/lib/api/wedding-planner";
import { queryKeys } from "@/lib/query/keys";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import type { Event } from "@/lib/api/types";
import { ViewHeader } from "../components/ViewHeader";
import { WeddingPlannerTimelineClient } from "./WeddingPlannerTimelineClient";

export const WeddingPlannerTimeline = async ({
  event: eventProp,
}: { event?: Event | null } = {}) => {
  const event = eventProp ?? (await requireFilledCoupleEvent());

  if (!event) {
    const t = await getTranslations();
    return (
      <div>
        <ViewHeader
          title={t("wp__timeline__title")}
          subtitle={t("wp__timeline__sub")}
        />
        <p className="type-body-small text-muted-foreground">
          {t("wp__timeline__no_event")}
        </p>
      </div>
    );
  }

  const [initial, initialTasks] = await Promise.all([
    weddingPlannerApi
      .getTimeline(event.id)
      .catch(() => ({ timeline: { phases: [] } })),
    weddingPlannerApi.listTodos(event.id).catch(() => ({ todos: [] })),
  ]);

  const queryClient = new QueryClient();
  queryClient.setQueryData(
    queryKeys.weddingPlanner.timeline(event.id),
    initial,
  );
  queryClient.setQueryData(
    queryKeys.weddingPlanner.tasks(event.id),
    initialTasks,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WeddingPlannerTimelineClient eventId={event.id} />
    </HydrationBoundary>
  );
};
