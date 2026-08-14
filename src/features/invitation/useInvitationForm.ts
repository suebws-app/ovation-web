"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import type { Event, Invitee } from "@/lib/api/types";
import { getEventTypeConfig } from "@/lib/event-types";
import { DEFAULT_INVITATION_TEMPLATE_ID } from "./invitationTemplates";
import { getInvitationSchema, type InvitationFields } from "./invitationSchema";

type InvitationFormDefaultsArgs = {
  event: Event | null;
  invitees: Invitee[];
  t: (key: string) => string;
};

const buildDefaults = ({
  event,
  invitees,
  t,
}: InvitationFormDefaultsArgs): InvitationFields => ({
  templateId: event?.invitationTemplateId ?? DEFAULT_INVITATION_TEMPLATE_ID,
  pageBg:
    typeof event?.details?.pageBg === "string" ? event.details.pageBg : "",
  surroundBg:
    typeof event?.details?.surroundBg === "string"
      ? event.details.surroundBg
      : "",
  cardBg:
    typeof event?.details?.cardBg === "string" ? event.details.cardBg : "",
  textColor:
    typeof event?.details?.textColor === "string"
      ? event.details.textColor
      : "",
  mutedColor:
    typeof event?.details?.mutedColor === "string"
      ? event.details.mutedColor
      : "",
  accentColor:
    typeof event?.details?.accentColor === "string"
      ? event.details.accentColor
      : "",
  textScale:
    typeof event?.details?.textScale === "number" ? event.details.textScale : 1,
  eventName:
    typeof event?.details?.eventName === "string"
      ? event.details.eventName
      : "",
  customEventNoun:
    typeof event?.details?.customEventNoun === "string"
      ? event.details.customEventNoun
      : "",
  partnerA: event?.hostAName ?? event?.partnerAName ?? "",
  partnerB: event?.hostBName ?? "",
  weddingDate: event?.eventDate ?? event?.weddingDate ?? "",
  endDate: event?.endDate ?? "",
  multiDay: Boolean(event?.endDate),
  bornOn:
    typeof event?.details?.bornOn === "string" ? event.details.bornOn : "",
  passedOn:
    typeof event?.details?.passedOn === "string" ? event.details.passedOn : "",
  time: typeof event?.details?.time === "string" ? event.details.time : "",
  venue: event?.venueName ?? "",
  place: event?.venueCity ?? "",
  message:
    event?.welcomeMessage ||
    t(`guest__welcome_default__${getEventTypeConfig(event?.eventType).type}`),
  greeting:
    typeof event?.details?.greeting === "string" && event.details.greeting
      ? event.details.greeting
      : "Dear",
  age: typeof event?.details?.age === "number" ? String(event.details.age) : "",
  showAge: event?.details?.showAge !== false,
  showRsvp: event?.details?.showRsvp !== false,
  agenda:
    typeof event?.details?.agenda === "string" ? event.details.agenda : "",
  attachAgenda: event?.details?.attachAgenda === true,
  logo: typeof event?.details?.logo === "string" ? event.details.logo : "",
  showLogo:
    typeof event?.details?.showLogo === "boolean"
      ? event.details.showLogo
      : typeof event?.details?.logo === "string" && Boolean(event.details.logo),
  guests: invitees.map((invitee) => ({
    id: invitee.id,
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
      t,
    }),
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });
};
