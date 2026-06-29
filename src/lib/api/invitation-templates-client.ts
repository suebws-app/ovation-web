import { clientFetch } from "./client";
import type { InvitationTemplatesResponse } from "./types";

export const invitationTemplatesClient = {
  list: () => clientFetch<InvitationTemplatesResponse>("/invitation-templates"),
};
