"use client";

import { useTranslations } from "next-intl";
import { CenteredModal } from "@/components/CenteredModal";
import {
  useBulkReplaceInvitees,
  useInvitees,
} from "@/lib/query/inviteesQueries";
import { useInviteeImport } from "./InviteeImport";
import type { ImportInvitee } from "./inviteeImportParser";

type InviteeImportModalProps = {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const InviteeImportModal = ({
  eventId,
  open,
  onOpenChange,
}: InviteeImportModalProps) => {
  const t = useTranslations();
  const { data: existing = [] } = useInvitees(eventId);
  const bulkReplace = useBulkReplaceInvitees(eventId);

  const handleConfirm = async (parsed: ImportInvitee[]) => {
    const merged = [
      ...existing.map((invitee) => ({
        firstName: invitee.firstName,
        email: invitee.email ?? undefined,
        phone: invitee.phone ?? undefined,
        seats: invitee.seats,
      })),
      ...parsed.map((item) => ({
        firstName: item.firstName,
        email: item.email,
        phone: item.phone,
        seats: item.seats,
      })),
    ];
    await bulkReplace.mutateAsync({ items: merged });
    onOpenChange(false);
  };

  const { body, footer } = useInviteeImport({
    onConfirm: handleConfirm,
    isSubmitting: bulkReplace.isPending,
  });

  return (
    <CenteredModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("invitees__import__title")}
      description={t("invitees__import__description")}
      footer={footer}
    >
      {body}
    </CenteredModal>
  );
};
