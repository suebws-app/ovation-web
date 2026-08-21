import { getEventFromParams } from "@/lib/auth/event-from-params";
import { WeddingPlannerDashboard } from "./WeddingPlannerDashboard";

type EventWeddingPlannerDashboardProps = {
  params: Promise<{ id: string }>;
};

export const EventWeddingPlannerDashboard = async ({
  params,
}: EventWeddingPlannerDashboardProps) => {
  const event = await getEventFromParams(params);
  return <WeddingPlannerDashboard event={event} />;
};
