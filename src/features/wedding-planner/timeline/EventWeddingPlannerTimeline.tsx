import { getEventFromParams } from "@/lib/auth/event-from-params";
import { WeddingPlannerTimeline } from "./WeddingPlannerTimeline";

type EventWeddingPlannerTimelineProps = {
  params: Promise<{ id: string }>;
};

export const EventWeddingPlannerTimeline = async ({
  params,
}: EventWeddingPlannerTimelineProps) => {
  const event = await getEventFromParams(params);
  return <WeddingPlannerTimeline event={event} />;
};
