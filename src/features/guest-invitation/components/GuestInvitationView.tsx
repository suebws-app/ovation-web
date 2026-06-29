"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import type { InvitationTemplate, PublicInvitation } from "@/lib/api/types";
import { InviteCard } from "@/features/invitation/components/InviteCard";
import { InvitationOpenTracker } from "@/features/guest/InvitationOpenTracker";
import { useGuestSubmissionStore } from "@/features/guest/store/useGuestSubmissionStore";

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

type GuestInvitationViewProps = {
  slug: string;
  token: string;
  event: PublicInvitation["event"];
  invitee: PublicInvitation["invitee"];
  template: InvitationTemplate;
};

export const GuestInvitationView = ({
  slug,
  token,
  event,
  invitee,
  template,
}: GuestInvitationViewProps) => {
  const t = useTranslations();
  const setGuestName = useGuestSubmissionStore((s) => s.setGuestName);
  const currentGuestName = useGuestSubmissionStore((s) => s.guestName);

  useEffect(() => {
    if (!currentGuestName && invitee.firstName) {
      setGuestName(invitee.firstName);
    }
  }, [currentGuestName, invitee.firstName, setGuestName]);

  const canSubmit = event.submissionOpen && !event.limitReached;
  const closedMessage = event.limitReached
    ? t("guest_invitation__closed_limit")
    : !event.submissionOpen
      ? t("guest_invitation__closed_not_open")
      : t("guest_invitation__closed_other");

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: template.pageBg }}
        aria-hidden
      />
      <div className="relative h-dvh w-full overflow-y-auto">
        <InvitationOpenTracker slug={slug} token={token} />

        <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-6 px-4 py-8">
          <div className="flex w-full items-center justify-center">
            <div className="tablet:max-w-xl desktop:max-w-2xl aspect-5/7 w-full max-w-lg shadow-2xl">
              <InviteCard
                template={template}
                size="large"
                values={{
                  partnerA: event.partnerAName,
                  partnerB: event.partnerBName,
                  dateLabel: formatDateLabel(event.weddingDate),
                  venue: event.venueName ?? undefined,
                  place: event.venueCity ?? undefined,
                  message: event.welcomeMessage ?? undefined,
                }}
                guestFirstName={invitee.firstName}
              />
            </div>
          </div>

          <div className="tablet:max-w-xl desktop:max-w-2xl flex w-full max-w-lg flex-col items-center gap-3">
            {canSubmit ? (
              <>
                <Button
                  asChild
                  className="w-full rounded-full shadow-lg"
                  style={{
                    background: template.accentColor,
                    color: template.buttonText,
                  }}
                >
                  <Link href={`/g/${slug}/compose`}>
                    {t("guest_invitation__cta")}
                  </Link>
                </Button>
                <p
                  className="type-caption text-center"
                  style={{ color: template.mutedColor }}
                >
                  {t("guest_invitation__cta_caption")}
                </p>
              </>
            ) : (
              <div
                className="rounded-16 border p-4.5"
                style={{ borderColor: template.accentColor }}
              >
                <p
                  className="type-body-small text-center"
                  style={{ color: template.textColor }}
                >
                  {closedMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
