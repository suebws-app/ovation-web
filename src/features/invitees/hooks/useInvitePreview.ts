import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Event } from "@/lib/api/types";
import { eventCardTitle, formatDateRange } from "@/lib/event-types";
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
        eventName:
          typeof event.details?.eventName === "string"
            ? event.details.eventName
            : undefined,
        customEventNoun:
          typeof event.details?.customEventNoun === "string"
            ? event.details.customEventNoun
            : undefined,
      }),
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
