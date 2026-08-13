import { clientFetch } from "./client";
import type {
  InvitationBulkResult,
  InvitationCopyLinkResult,
  InvitationSendResult,
  SendInvitationInput,
} from "./types";

const invitationsPath = (eventId: string) => `/events/${eventId}/invitations`;

export const invitationsClient = {
  sendToInvitee: (
    eventId: string,
    inviteeId: string,
    input?: SendInvitationInput,
  ) =>
    clientFetch<InvitationSendResult>(
      `${invitationsPath(eventId)}/send/${inviteeId}`,
      { method: "POST", ...(input ? { body: input } : {}) },
    ),

  sendAll: (eventId: string, input?: SendInvitationInput) =>
    clientFetch<InvitationBulkResult>(`${invitationsPath(eventId)}/send-all`, {
      method: "POST",
      ...(input ? { body: input } : {}),
    }),

  copyLink: (eventId: string, inviteeId: string) =>
    clientFetch<InvitationCopyLinkResult>(
      `${invitationsPath(eventId)}/copy-link/${inviteeId}`,
      { method: "POST" },
    ),
};
