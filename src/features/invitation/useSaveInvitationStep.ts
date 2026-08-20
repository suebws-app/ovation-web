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

const designDetails = (values: InvitationFields): Record<string, unknown> => ({
  pageBg: values.pageBg?.trim() ?? "",
  surroundBg: values.surroundBg?.trim() ?? "",
  cardBg: values.cardBg?.trim() ?? "",
  textColor: values.textColor?.trim() ?? "",
  mutedColor: values.mutedColor?.trim() ?? "",
  accentColor: values.accentColor?.trim() ?? "",
  textScale: typeof values.textScale === "number" ? values.textScale : 1,
});

const designPayload = (values: InvitationFields): UpdateEventInput => ({
  invitationTemplateId: values.templateId,
  details: designDetails(values),
});

const detailsPayload = (
  values: InvitationFields,
  isEventMode: boolean,
): UpdateEventInput => {
  const payload: UpdateEventInput = {};
  if (isEventMode) {
    if (values.partnerA.trim()) payload.eventName = values.partnerA.trim();
  } else {
    if (values.partnerA.trim()) payload.partnerAName = values.partnerA.trim();
    if (values.partnerB.trim()) payload.partnerBName = values.partnerB.trim();
  }
  if (values.weddingDate) payload.weddingDate = values.weddingDate;
  payload.endDate = values.endDate || null;
  if (values.venue.trim()) payload.venueName = values.venue.trim();
  if (values.place.trim()) payload.venueCity = values.place.trim();
  if (values.message.trim()) payload.welcomeMessage = values.message.trim();
  const details: Record<string, unknown> = {};
  const eventName = values.eventName?.trim();
  if (eventName !== undefined) details.eventName = eventName;
  // Send the key even when blank: the API drops empty values after merging, so
  // omitting it would leave a previously saved noun in place forever.
  const customEventNoun = values.customEventNoun?.trim();
  if (customEventNoun !== undefined) details.customEventNoun = customEventNoun;
  if (values.time?.trim()) details.time = values.time.trim();
  const greeting = values.greeting?.trim();
  if (greeting) details.greeting = greeting;
  const ageValue = values.age?.trim();
  if (ageValue && Number.isFinite(Number(ageValue))) {
    details.age = Number(ageValue);
  }
  details.showAge = values.showAge;
  details.showRsvp = values.showRsvp;
  details.agenda = values.agenda?.trim() || undefined;
  details.attachAgenda = values.attachAgenda;
  details.logo = values.logo?.trim() || undefined;
  details.showLogo = values.showLogo;
  details.bornOn = values.bornOn?.trim() || undefined;
  details.passedOn = values.passedOn?.trim() || undefined;
  Object.assign(details, designDetails(values));
  if (Object.keys(details).length) payload.details = details;
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

export const useSaveInvitationStep = (
  eventId: string | null | undefined,
  isEventMode = false,
) => {
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
            step === "design"
              ? designPayload(values)
              : detailsPayload(values, isEventMode);
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
    [eventId, isEventMode],
  );

  return { save, status, error };
};
