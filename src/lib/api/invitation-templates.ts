import { apiFetch } from "./server";
import type { InvitationTemplatesResponse } from "./types";

export const invitationTemplatesApi = {
  list: () => apiFetch<InvitationTemplatesResponse>("/invitation-templates"),
};
