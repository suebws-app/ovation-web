"use client";

import { useEffect } from "react";
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
  const setGuestName = useGuestSubmissionStore((s) => s.setGuestName);
  const currentGuestName = useGuestSubmissionStore((s) => s.guestName);

  useEffect(() => {
    if (!currentGuestName && invitee.firstName) {
      setGuestName(invitee.firstName);
    }
  }, [currentGuestName, invitee.firstName, setGuestName]);

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
                animate
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
        </div>
      </div>
    </>
  );
};
