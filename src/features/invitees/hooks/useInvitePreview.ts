import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Event } from "@/lib/api/types";
import {
  eventCardTitle,
  formatDateRange,
  memorialLifeSpan,
} from "@/lib/event-types";
import { useInvitationTemplatesQuery } from "@/lib/query/invitationTemplatesQueries";
import { DEFAULT_INVITATION_TEMPLATE_ID } from "@/features/invitation/invitationTemplates";

const formatDateLabel = (raw: string): string => {
  const date = new Date(raw);
  return Number.isNaN(date.getTime())
    ? raw
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
};

/**
 * The type-specific subtitle rendered under the names on the card: corporate
 * shows the event name; memorial shows the life span "1950 – 2020".
 */
const cardSubtitle = (event: Event): string | undefined => {
  if (event.eventType === "corporate") {
    // Corporate: organization name is the title, event name sits below it.
    return typeof event.details?.eventName === "string" &&
      event.details.eventName.trim()
      ? event.details.eventName.trim()
      : undefined;
  }
  if (event.eventType === "memorial") {
    return memorialLifeSpan(event.details?.bornOn, event.details?.passedOn);
  }
  return undefined;
};

export const useInvitePreview = (event: Event) => {
  const t = useTranslations();
  const { data } = useInvitationTemplatesQuery();

  const template = useMemo(() => {
    const templates = data?.templates;
    if (!templates || templates.length === 0) return undefined;
    const selectedId =
      event.invitationTemplateId ??
      data?.defaultTemplateId ??
      DEFAULT_INVITATION_TEMPLATE_ID;
    return (
      templates.find((tpl) => tpl.id === selectedId) ??
      templates.find((tpl) => tpl.id === data?.defaultTemplateId) ??
      templates[0]
    );
  }, [data?.defaultTemplateId, data?.templates, event.invitationTemplateId]);

  const values = useMemo(
    () => ({
      ...eventCardTitle(t, {
        eventType: event.eventType,
        hostA: event.hostAName ?? event.partnerAName,
        hostB: event.hostBName ?? event.partnerBName,
        // Corporate keeps the organization (hostA) as the title and shows the
        // event name as the subtitle instead, so don't let it override here.
        eventName:
          event.eventType !== "corporate" &&
          typeof event.details?.eventName === "string"
            ? event.details.eventName
            : undefined,
        customEventNoun:
          typeof event.details?.customEventNoun === "string"
            ? event.details.customEventNoun
            : undefined,
      }),
      subtitle: cardSubtitle(event),
      logo:
        (typeof event.details?.showLogo === "boolean"
          ? event.details.showLogo
          : Boolean(event.details?.logo)) &&
        typeof event.details?.logo === "string"
          ? event.details.logo
          : undefined,
      dateLabel: formatDateRange(event, formatDateLabel) ?? undefined,
      venue: event.locationName ?? event.venueName ?? undefined,
      place: event.locationCity ?? event.venueCity ?? undefined,
      message: event.welcomeMessage ?? undefined,
      age:
        event.details?.showAge !== false &&
        typeof event.details?.age === "number"
          ? event.details.age
          : undefined,
    }),
    [t, event],
  );

  const overrides = useMemo(
    () => ({
      pageBg:
        typeof event.details?.pageBg === "string"
          ? event.details.pageBg
          : undefined,
      cardBg:
        typeof event.details?.cardBg === "string"
          ? event.details.cardBg
          : undefined,
      textColor:
        typeof event.details?.textColor === "string"
          ? event.details.textColor
          : undefined,
      mutedColor:
        typeof event.details?.mutedColor === "string"
          ? event.details.mutedColor
          : undefined,
      accentColor:
        typeof event.details?.accentColor === "string"
          ? event.details.accentColor
          : undefined,
      textScale:
        typeof event.details?.textScale === "number"
          ? event.details.textScale
          : undefined,
    }),
    [event],
  );

  return { template, values, overrides };
};
