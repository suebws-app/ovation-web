"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { InvitationTemplate, PublicInvitation } from "@/lib/api/types";
import { InviteCard } from "@/features/invitation/components/InviteCard";
import { InvitationOpenTracker } from "@/features/guest/InvitationOpenTracker";
import { useGuestSubmissionStore } from "@/features/guest/store/useGuestSubmissionStore";
import { RsvpActions } from "./RsvpActions";
import { eventCardTitle, getEventTypeConfig } from "@/lib/event-types";

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
  const titleParts = eventCardTitle(t, {
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
  });

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

        <div className="flex min-h-dvh w-full flex-col items-center justify-center px-4 py-8">
          <div className="tablet:max-w-xl desktop:max-w-2xl w-full max-w-lg shadow-2xl">
            <div className="aspect-5/7 w-full">
              <InviteCard
                template={template}
                size="large"
                animate
                values={{
                  ...titleParts,
                  dateLabel: formatDateLabel(
                    event.eventDate ?? event.weddingDate,
                  ),
                  venue: event.locationName ?? event.venueName ?? undefined,
                  place: event.locationCity ?? event.venueCity ?? undefined,
                  message: event.welcomeMessage ?? undefined,
                }}
                guestFirstName={invitee.firstName}
              />
            </div>

            {getEventTypeConfig(event.eventType).features.rsvp && (
              <RsvpActions
                slug={slug}
                token={token}
                invitee={invitee}
                template={template}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
