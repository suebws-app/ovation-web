"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MailIcon } from "@ovation/icons/MailIcon";
import { UploadIcon } from "@ovation/icons/UploadIcon";
import { EyeIcon } from "@ovation/icons/EyeIcon";
import { PencilIcon } from "@ovation/icons/PencilIcon";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { Event } from "@/lib/api/types";
import { toast } from "@/components/Toaster";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import {
  useInvitees,
  useSendInvitationsToAll,
} from "@/lib/query/inviteesQueries";
import { InviteeAddForm } from "./components/InviteeAddForm";
import { InviteeImportModal } from "./components/InviteeImportModal";
import { InviteeList } from "./components/InviteeList";
import { InvitePreviewModal } from "./components/InvitePreviewModal";

type InviteesPageClientProps = {
  event: Event;
};

export const InviteesPageClient = ({ event }: InviteesPageClientProps) => {
  const t = useTranslations();
  const eventId = event.id;
  const { data: invitees = [], isLoading, isError } = useInvitees(eventId);
  const sendAll = useSendInvitationsToAll(eventId);
  const [importOpen, setImportOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

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
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
            className="rounded-full"
          >
            <EyeIcon width={13} height={13} />
            {t("invitees__preview__cta")}
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href={appRoutes.app.invitation}>
              <PencilIcon width={13} height={13} />
              {t("invitees__edit_card__cta")}
            </Link>
          </Button>
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

      <InvitePreviewModal
        event={event}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
};
