import { getEventFromParams } from "@/lib/auth/event-from-params";
import { InviteesPage } from "./InviteesPage";

type EventInviteesPageProps = {
  params: Promise<{ id: string }>;
};

export const EventInviteesPage = async ({ params }: EventInviteesPageProps) => {
  const event = await getEventFromParams(params);
  return <InviteesPage event={event} />;
};
