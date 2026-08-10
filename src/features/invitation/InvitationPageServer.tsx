import { getCurrentEvent } from "@/lib/auth/current-event";
import { inviteesApi } from "@/lib/api/invitees";
import type { Invitee } from "@/lib/api/types";
import { invitationFontVariables } from "./invitationFonts";
import { InvitationPage } from "./InvitationPage";

export const InvitationPageServer = async () => {
  const event = await getCurrentEvent();

  let initialInvitees: Invitee[] = [];
  if (event?.id) {
    const result = await inviteesApi.list(event.id).catch(() => null);
    initialInvitees = result?.invitees ?? [];
  }

  return (
    <div className={`${invitationFontVariables} contents`}>
      <InvitationPage
        eventId={event?.id ?? null}
        initialEvent={event ?? null}
        initialInvitees={initialInvitees}
      />
    </div>
  );
};
