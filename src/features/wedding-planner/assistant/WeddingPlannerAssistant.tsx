import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { weddingPlannerApi } from "@/lib/api/wedding-planner";
import { queryKeys } from "@/lib/query/keys";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { ViewHeader } from "../components/ViewHeader";
import { WeddingPlannerAssistantClient } from "./WeddingPlannerAssistantClient";

export const WeddingPlannerAssistant = async () => {
  const event = await requireFilledCoupleEvent();

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
