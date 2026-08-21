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
import { WeddingPlannerTasksClient } from "./WeddingPlannerTasksClient";

export const WeddingPlannerTasks = async ({
  event: eventProp,
}: { event?: Event | null } = {}) => {
  const event = eventProp ?? (await requireFilledCoupleEvent());

  if (!event) {
    const t = await getTranslations();
    return (
      <div>
        <ViewHeader
          title={t("wp__tasks__title")}
          subtitle={t("wp__tasks__sub")}
        />
        <p className="type-body-small text-muted-foreground">
          {t("wp__tasks__no_event")}
        </p>
      </div>
    );
  }

  const initial = await weddingPlannerApi
    .listTodos(event.id)
    .catch(() => ({ todos: [] }));

  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKeys.weddingPlanner.tasks(event.id), initial);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WeddingPlannerTasksClient eventId={event.id} />
    </HydrationBoundary>
  );
};
