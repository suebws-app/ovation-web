import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { weddingPlannerApi } from "@/lib/api/wedding-planner";
import { queryKeys } from "@/lib/query/keys";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { getCurrentUser } from "@/lib/auth/session";
import { isPaidPlan } from "@/lib/utils/plan";
import { eventDateOf, eventTitleLine, showsCountdown } from "@/lib/event-types";
import { ViewHeader } from "../components/ViewHeader";
import { WeddingPlannerDashboardClient } from "./WeddingPlannerDashboardClient";

export const WeddingPlannerDashboard = async () => {
  const [event, user] = await Promise.all([
    requireFilledCoupleEvent(),
    getCurrentUser(),
  ]);
  const assistantLocked = !isPaidPlan(user?.planTier);

  if (!event) {
    const t = await getTranslations();
    return (
      <div>
        <ViewHeader title={t("wp__dash__progress_title")} />
        <p className="type-body-small text-muted-foreground">
          {t("wp__timeline__no_event")}
        </p>
      </div>
    );
  }

  const [timeline, tasks, budget] = await Promise.all([
    weddingPlannerApi
      .getTimeline(event.id)
      .catch(() => ({ timeline: { phases: [] } })),
    weddingPlannerApi.listTodos(event.id).catch(() => ({ todos: [] })),
    weddingPlannerApi.getBudget(event.id).catch(() => ({
      budget: { totalBudget: 0, categories: [], payments: [] },
    })),
  ]);

  const queryClient = new QueryClient();
  queryClient.setQueryData(
    queryKeys.weddingPlanner.timeline(event.id),
    timeline,
  );
  queryClient.setQueryData(queryKeys.weddingPlanner.tasks(event.id), tasks);
  queryClient.setQueryData(queryKeys.weddingPlanner.budget(event.id), budget);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WeddingPlannerDashboardClient
        eventId={event.id}
        partners={eventTitleLine(event)}
        weddingDate={eventDateOf(event)}
        endDate={event.endDate}
        venue={event.locationName ?? event.venueName}
        city={event.locationCity ?? event.venueCity}
        showCountdown={showsCountdown(event)}
        assistantLocked={assistantLocked}
      />
    </HydrationBoundary>
  );
};
