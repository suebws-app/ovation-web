import { getEventFromParams } from "@/lib/auth/event-from-params";
import { InvitationPageServer } from "./InvitationPageServer";

type EventInvitationPageServerProps = {
  params: Promise<{ id: string }>;
};

export const EventInvitationPageServer = async ({
  params,
}: EventInvitationPageServerProps) => {
  const event = await getEventFromParams(params);
  return <InvitationPageServer event={event} />;
};
