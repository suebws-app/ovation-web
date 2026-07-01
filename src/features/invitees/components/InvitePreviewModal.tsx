"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Event } from "@/lib/api/types";
import { CenteredModal } from "@/components/CenteredModal";
import { InviteCard } from "@/features/invitation/components/InviteCard";
import { PhonePreview } from "@/features/invitation/components/PhonePreview";
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

type InvitePreviewModalProps = {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const InvitePreviewModal = ({
  event,
  open,
  onOpenChange,
}: InvitePreviewModalProps) => {
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

  return (
    <CenteredModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("invitees__preview__title")}
      contentClassName="h-185"
    >
      <div className="flex h-full flex-col items-center justify-center">
        <PhonePreview>
          {template ? (
            <InviteCard
              template={template}
              animate
              values={{
                partnerA: event.partnerAName,
                partnerB: event.partnerBName,
                dateLabel: formatDateLabel(event.weddingDate),
                venue: event.venueName ?? undefined,
                place: event.venueCity ?? undefined,
                message: event.welcomeMessage ?? undefined,
              }}
            />
          ) : (
            <div className="bg-muted h-full w-full animate-pulse" />
          )}
        </PhonePreview>
      </div>
    </CenteredModal>
  );
};
