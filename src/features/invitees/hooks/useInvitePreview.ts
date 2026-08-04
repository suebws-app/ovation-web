import { useMemo } from "react";
import type { Event } from "@/lib/api/types";
import { useInvitationTemplatesQuery } from "@/lib/query/invitationTemplatesQueries";
import { DEFAULT_INVITATION_TEMPLATE_ID } from "@/features/invitation/invitationTemplates";

const formatDateLabel = (iso: string | null): string | undefined => {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const useInvitePreview = (event: Event) => {
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

  const values = useMemo(() => {
    const isEventMode = Boolean(event.eventName?.trim());
    return {
      partnerA: isEventMode ? event.eventName! : event.partnerAName,
      partnerB: isEventMode ? "" : event.partnerBName,
      singleName: isEventMode,
      dateLabel: formatDateLabel(event.weddingDate),
      venue: event.venueName ?? undefined,
      place: event.venueCity ?? undefined,
      message: event.welcomeMessage ?? undefined,
    };
  }, [
    event.eventName,
    event.partnerAName,
    event.partnerBName,
    event.weddingDate,
    event.venueName,
    event.venueCity,
    event.welcomeMessage,
  ]);

  return { template, values };
};
