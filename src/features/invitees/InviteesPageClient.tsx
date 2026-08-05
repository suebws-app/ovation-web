"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MailIcon } from "@ovation/icons/MailIcon";
import { UploadIcon } from "@ovation/icons/UploadIcon";
import { ChevronLeftIcon } from "@ovation/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@ovation/icons/ChevronRightIcon";
import { Button } from "@ovation/ui/components/Button";
import { cn } from "@ovation/ui/utils/cn";
import type { Event } from "@/lib/api/types";
import { toast } from "@/components/Toaster";
import { ViewHeader } from "@/features/wedding-planner/components/ViewHeader";
import {
  useInvitees,
  useSendInvitationsToAll,
} from "@/lib/query/inviteesQueries";
import dynamic from "next/dynamic";
import { InviteeList } from "./components/InviteeList";
import { InviteePreviewPane } from "./components/InviteePreviewPane";

const InviteeImportModal = dynamic(
  () =>
    import("./components/InviteeImportModal").then((m) => m.InviteeImportModal),
  { ssr: false },
);
const InvitePreviewModal = dynamic(
  () =>
    import("./components/InvitePreviewModal").then((m) => m.InvitePreviewModal),
  { ssr: false },
);

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
  const [paneOpen, setPaneOpen] = useState(true);

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
    <div className="pb-24">
      <ViewHeader
        title={t("invitees__title")}
        subtitle={t("invitees__subtitle", { count: invitees.length })}
      />

      <button
        type="button"
        onClick={() => setPaneOpen((open) => !open)}
        aria-label={
          paneOpen ? t("invitees__preview__hide") : t("invitees__preview__show")
        }
        className="border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted desktop:flex fixed top-1/2 right-0 z-30 hidden -translate-y-1/2 items-center justify-center rounded-l-xl border border-r-0 py-5 pr-1 pl-1.5 shadow-lg transition-colors"
      >
        {paneOpen ? (
          <ChevronRightIcon width={16} height={16} />
        ) : (
          <ChevronLeftIcon width={16} height={16} />
        )}
      </button>

      <div className="desktop:flex-row flex flex-col gap-6">
        <div className="min-w-0 flex-1">
          <InviteeList
            eventId={eventId}
            invitees={invitees}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        <div
          aria-hidden={!paneOpen}
          className={cn(
            "w-full translate-x-0 opacity-100 transition-all duration-300 ease-out",
            paneOpen
              ? "desktop:w-80 desktop:shrink-0 desktop:translate-x-0 desktop:opacity-100"
              : "desktop:pointer-events-none desktop:w-0 desktop:shrink-0 desktop:translate-x-4 desktop:overflow-hidden desktop:opacity-0",
          )}
        >
          <InviteePreviewPane
            event={event}
            onOpenPreview={() => setPreviewOpen(true)}
          />
        </div>
      </div>

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

      <footer className="border-border bg-card tablet:px-8 desktop:left-(--sidebar-width) fixed right-0 bottom-0 left-0 z-20 flex items-center justify-end gap-2 border-t px-4 py-4">
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
      </footer>
    </div>
  );
};
