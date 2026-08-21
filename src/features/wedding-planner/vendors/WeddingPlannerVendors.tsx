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
import { WeddingPlannerVendorsClient } from "./WeddingPlannerVendorsClient";

export const WeddingPlannerVendors = async ({
  event: eventProp,
}: { event?: Event | null } = {}) => {
  const event = eventProp ?? (await requireFilledCoupleEvent());

  if (!event) {
    const t = await getTranslations();
    return (
      <div>
        <ViewHeader
          title={t("wp__vendors__title")}
          subtitle={t("wp__vendors__sub")}
        />
        <p className="type-body-small text-muted-foreground">
          {t("wp__vendors__no_event")}
        </p>
      </div>
    );
  }

  const initial = await weddingPlannerApi
    .listVendors(event.id)
    .catch(() => ({ vendors: [] }));

  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKeys.weddingPlanner.vendors(event.id), initial);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WeddingPlannerVendorsClient eventId={event.id} />
    </HydrationBoundary>
  );
};
