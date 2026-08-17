import { getEventFromParams } from "@/lib/auth/event-from-params";
import { WeddingPlannerBudget } from "./WeddingPlannerBudget";

type EventWeddingPlannerBudgetProps = {
  params: Promise<{ id: string }>;
};

export const EventWeddingPlannerBudget = async ({
  params,
}: EventWeddingPlannerBudgetProps) => {
  const event = await getEventFromParams(params);
  return <WeddingPlannerBudget event={event} />;
};
