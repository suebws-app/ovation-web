"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MailIcon } from "@ovation/icons/MailIcon";
import { UploadIcon } from "@ovation/icons/UploadIcon";
import { Button } from "@ovation/ui/components/Button";
import { toast } from "@/components/Toaster";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import {
  useInvitees,
  useSendInvitationsToAll,
} from "@/lib/query/inviteesQueries";
import { InviteeAddForm } from "./components/InviteeAddForm";
import { InviteeImportModal } from "./components/InviteeImportModal";
import { InviteeList } from "./components/InviteeList";

type InviteesPageClientProps = {
  eventId: string;
};

export const InviteesPageClient = ({ eventId }: InviteesPageClientProps) => {
  const t = useTranslations();
  const { data: invitees = [], isLoading, isError } = useInvitees(eventId);
  const sendAll = useSendInvitationsToAll(eventId);
  const [importOpen, setImportOpen] = useState(false);

  const unsentWithEmail = useMemo(
    () =>
      invitees.filter(
        (invitee) => !invitee.lastSentAt && Boolean(invitee.email),
      ).length,
    [invitees],
  );

  const handleSendAll = async () => {
    if (
      !window.confirm(
        t("invitees__send_all__confirm", { count: unsentWithEmail }),
      )
    ) {
      return;
    }
    try {
      const result = await sendAll.mutateAsync();
      toast.success(
        t("invitees__send_all__success", {
          queued: result.queued,
          skipped: result.skipped,
        }),
      );
    } catch {
      toast.error(t("invitees__send_all__error"));
    }
  };

  return (
    <div className={containerClassName}>
      <header className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col gap-3">
        <div>
          <h1 className="type-h2 tracking-tight">{t("invitees__title")}</h1>
          <p className="type-body-small text-muted-foreground mt-1">
            {t("invitees__subtitle", { count: invitees.length })}
          </p>
        </div>
      </header>

      <InviteeAddForm eventId={eventId} />

      <InviteeList
        eventId={eventId}
        invitees={invitees}
        isLoading={isLoading}
        isError={isError}
        actions={
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setImportOpen(true)}
              className="rounded-full"
            >
              <UploadIcon width={13} height={13} />
              {t("invitees__import__cta")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSendAll}
              disabled={unsentWithEmail === 0 || sendAll.isPending}
              className="rounded-full"
            >
              <MailIcon width={13} height={13} />
              {sendAll.isPending
                ? t("invitees__send_all__sending")
                : t("invitees__send_all__cta", { count: unsentWithEmail })}
            </Button>
          </>
        }
      />

      <InviteeImportModal
        eventId={eventId}
        open={importOpen}
        onOpenChange={setImportOpen}
      />
    </div>
  );
};
