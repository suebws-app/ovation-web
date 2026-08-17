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
import { WeddingPlannerBudgetClient } from "./WeddingPlannerBudgetClient";

export const WeddingPlannerBudget = async ({
  event: eventProp,
}: { event?: Event | null } = {}) => {
  const event = eventProp ?? (await requireFilledCoupleEvent());

  if (!event) {
    const t = await getTranslations();
    return (
      <div>
        <ViewHeader title={t("wp__budget__title")} />
        <p className="type-body-small text-muted-foreground">
          {t("wp__budget__no_event")}
        </p>
      </div>
    );
  }

  const initial = await weddingPlannerApi.getBudget(event.id).catch(() => ({
    budget: { totalBudget: 0, categories: [], payments: [] },
  }));

  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKeys.weddingPlanner.budget(event.id), initial);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WeddingPlannerBudgetClient eventId={event.id} />
    </HydrationBoundary>
  );
};
