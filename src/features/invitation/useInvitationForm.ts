"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import type { Event, Invitee } from "@/lib/api/types";
import { DEFAULT_INVITATION_TEMPLATE_ID } from "./invitationTemplates";
import { getInvitationSchema, type InvitationFields } from "./invitationSchema";

type InvitationFormDefaultsArgs = {
  event: Event | null;
  invitees: Invitee[];
};

const buildDefaults = ({
  event,
  invitees,
}: InvitationFormDefaultsArgs): InvitationFields => ({
  templateId: event?.invitationTemplateId ?? DEFAULT_INVITATION_TEMPLATE_ID,
  partnerA: event?.partnerAName ?? "",
  partnerB: event?.partnerBName ?? "",
  weddingDate: event?.weddingDate ?? "",
  time: "",
  venue: event?.venueName ?? "",
  place: event?.venueCity ?? "",
  message: event?.welcomeMessage ?? "",
  guests: invitees.map((invitee) => ({
    first: invitee.firstName,
    email: invitee.email ?? "",
    phone: invitee.phone ?? "",
    seats: invitee.seats,
  })),
});

export const useInvitationForm = (
  initialEvent: Event | null,
  initialInvitees: Invitee[],
) => {
  const t = useTranslations();
  const schema = useMemo(() => getInvitationSchema(t), [t]);

  return useForm<InvitationFields>({
    defaultValues: buildDefaults({
      event: initialEvent,
      invitees: initialInvitees,
    }),
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });
};
