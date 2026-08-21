import { getEventFromParams } from "@/lib/auth/event-from-params";
import { WeddingPlannerVendors } from "./WeddingPlannerVendors";

type EventWeddingPlannerVendorsProps = {
  params: Promise<{ id: string }>;
};

export const EventWeddingPlannerVendors = async ({
  params,
}: EventWeddingPlannerVendorsProps) => {
  const event = await getEventFromParams(params);
  return <WeddingPlannerVendors event={event} />;
};
