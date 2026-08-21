import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { weddingPlannerApi } from "@/lib/api/wedding-planner";
import { queryKeys } from "@/lib/query/keys";
import { appRoutes } from "@/lib/routes";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { getCurrentUser } from "@/lib/auth/session";
import { isPaidPlan } from "@/lib/utils/plan";
import type { Event } from "@/lib/api/types";
import { ViewHeader } from "../components/ViewHeader";
import { WeddingPlannerAssistantClient } from "./WeddingPlannerAssistantClient";

export const WeddingPlannerAssistant = async ({
  event: eventProp,
}: { event?: Event | null } = {}) => {
  const [event, user] = await Promise.all([
    eventProp ? Promise.resolve(eventProp) : requireFilledCoupleEvent(),
    getCurrentUser(),
  ]);
  if (!isPaidPlan(user?.planTier)) {
    redirect(appRoutes.app.plans);
  }

  if (!event) {
    const t = await getTranslations();
    return (
      <div>
        <ViewHeader title={t("wp__ai__title")} subtitle={t("wp__ai__sub")} />
        <p className="type-body-small text-muted-foreground">
          {t("wp__ai__no_event")}
        </p>
      </div>
    );
  }

  const initial = await weddingPlannerApi
    .getAssistantMessages(event.id)
    .catch(() => ({ messages: [] }));

  const queryClient = new QueryClient();
  queryClient.setQueryData(
    queryKeys.weddingPlanner.assistant(event.id),
    initial,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WeddingPlannerAssistantClient eventId={event.id} />
    </HydrationBoundary>
  );
};
