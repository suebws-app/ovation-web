import { getEventFromParams } from "@/lib/auth/event-from-params";
import { WeddingPlannerAssistant } from "./WeddingPlannerAssistant";

type EventWeddingPlannerAssistantProps = {
  params: Promise<{ id: string }>;
};

export const EventWeddingPlannerAssistant = async ({
  params,
}: EventWeddingPlannerAssistantProps) => {
  const event = await getEventFromParams(params);
  return <WeddingPlannerAssistant event={event} />;
};
