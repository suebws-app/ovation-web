"use client";

import { useTranslations } from "next-intl";
import type { Event } from "@/lib/api/types";
import { CenteredModal } from "@/components/CenteredModal";
import { InviteCard } from "@/features/invitation/components/InviteCard";
import { PhonePreview } from "@/features/invitation/components/PhonePreview";
import { useInvitePreview } from "../hooks/useInvitePreview";

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
  const { template, values } = useInvitePreview(event);

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
            <InviteCard template={template} animate values={values} />
          ) : (
            <div className="bg-muted h-full w-full animate-pulse" />
          )}
        </PhonePreview>
      </div>
    </CenteredModal>
  );
};
