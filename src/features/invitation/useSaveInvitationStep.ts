"use client";

import { useCallback, useState } from "react";
import { eventsClient } from "@/lib/api/events-client";
import { inviteesClient } from "@/lib/api/invitees-client";
import { ApiError } from "@/lib/api/client";
import type {
  BulkReplaceInviteesInput,
  UpdateEventInput,
} from "@/lib/api/types";
import type { InvitationStepId } from "./constants";
import type { InvitationFields } from "./invitationSchema";

const designPayload = (values: InvitationFields): UpdateEventInput => ({
  invitationTemplateId: values.templateId,
});

const detailsPayload = (values: InvitationFields): UpdateEventInput => {
  const payload: UpdateEventInput = {};
  if (values.partnerA.trim()) payload.partnerAName = values.partnerA.trim();
  if (values.partnerB.trim()) payload.partnerBName = values.partnerB.trim();
  if (values.weddingDate) payload.weddingDate = values.weddingDate;
  if (values.venue.trim()) payload.venueName = values.venue.trim();
  if (values.place.trim()) payload.venueCity = values.place.trim();
  if (values.message.trim()) payload.welcomeMessage = values.message.trim();
  return payload;
};

const guestsPayload = (values: InvitationFields): BulkReplaceInviteesInput => ({
  items: values.guests
    .filter((guest) => guest.first.trim().length > 0)
    .map((guest) => ({
      id: guest.id,
      firstName: guest.first.trim(),
      email: guest.email.trim() || undefined,
      phone: guest.phone.trim() || undefined,
      seats: guest.seats,
    })),
});

export type SaveStatus = "idle" | "saving" | "saved" | "error";

type SaveResult = { ok: boolean; error?: string };

export const useSaveInvitationStep = (eventId: string | null | undefined) => {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (
      step: InvitationStepId,
      values: InvitationFields,
    ): Promise<SaveResult> => {
      if (!eventId) return { ok: false, error: "no-event" };

      setStatus("saving");
      setError(null);
      try {
        if (step === "guests") {
          await inviteesClient.bulkReplace(eventId, guestsPayload(values));
        } else {
          const payload =
            step === "design" ? designPayload(values) : detailsPayload(values);
          if (Object.keys(payload).length === 0) {
            setStatus("saved");
            return { ok: true };
          }
          await eventsClient.update(eventId, payload);
        }
        setStatus("saved");
        return { ok: true };
      } catch (err) {
        const message = ApiError.isApiError(err) ? err.message : "save-failed";
        setError(message);
        setStatus("error");
        return { ok: false, error: message };
      }
    },
    [eventId],
  );

  return { save, status, error };
};
