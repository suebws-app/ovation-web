import { clientFetch } from "./client";
import type {
  InvitationBulkResult,
  InvitationCopyLinkResult,
  InvitationSendResult,
} from "./types";

const invitationsPath = (eventId: string) => `/events/${eventId}/invitations`;

export const invitationsClient = {
  sendToInvitee: (eventId: string, inviteeId: string) =>
    clientFetch<InvitationSendResult>(
      `${invitationsPath(eventId)}/send/${inviteeId}`,
      { method: "POST" },
    ),

  sendAll: (eventId: string) =>
    clientFetch<InvitationBulkResult>(`${invitationsPath(eventId)}/send-all`, {
      method: "POST",
    }),

  copyLink: (eventId: string, inviteeId: string) =>
    clientFetch<InvitationCopyLinkResult>(
      `${invitationsPath(eventId)}/copy-link/${inviteeId}`,
      { method: "POST" },
    ),
};
