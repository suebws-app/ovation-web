import { getEventFromParams } from "@/lib/auth/event-from-params";
import { WeddingPlannerTasks } from "./WeddingPlannerTasks";

type EventWeddingPlannerTasksProps = {
  params: Promise<{ id: string }>;
};

export const EventWeddingPlannerTasks = async ({
  params,
}: EventWeddingPlannerTasksProps) => {
  const event = await getEventFromParams(params);
  return <WeddingPlannerTasks event={event} />;
};
