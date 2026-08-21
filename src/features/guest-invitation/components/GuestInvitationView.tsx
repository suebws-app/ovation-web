"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { InvitationTemplate, PublicInvitation } from "@/lib/api/types";
import { EventThemeScope } from "@/lib/theme/EventThemeScope";
import { InviteCard } from "@/features/invitation/components/InviteCard";
import { InvitationOpenTracker } from "@/features/guest/InvitationOpenTracker";
import { useGuestSubmissionStore } from "@/features/guest/store/useGuestSubmissionStore";
import { RsvpActions } from "./RsvpActions";
import {
  eventCardTitle,
  formatDateRange,
  isDateRange,
  memorialLifeSpan,
  getEventTypeConfig,
} from "@/lib/event-types";

const formatDateLabel = (raw: string): string => {
  const date = new Date(raw);
  return Number.isNaN(date.getTime())
    ? raw
    : date.toLocaleDateString("en-GB", {
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
  const detailsEventName =
    typeof event.details?.eventName === "string"
      ? event.details.eventName.trim()
      : "";
  const isCorporate = event.eventType === "corporate";
  const titleParts = eventCardTitle(t, {
    eventType: event.eventType,
    hostA: event.hostAName ?? event.partnerAName,
    hostB: event.hostBName ?? event.partnerBName,
    // Corporate keeps the organization (hostA) as the title; the event name is
    // shown as a subtitle below, not as an overriding single line.
    eventName: isCorporate ? undefined : detailsEventName || undefined,
    customEventNoun:
      typeof event.details?.customEventNoun === "string"
        ? event.details.customEventNoun
        : undefined,
  });
  const cardSubtitle = isCorporate
    ? detailsEventName || undefined
    : event.eventType === "memorial"
      ? memorialLifeSpan(event.details?.bornOn, event.details?.passedOn)
      : undefined;

  const detailStr = (key: string): string | undefined => {
    const value = event.details?.[key];
    return typeof value === "string" && value ? value : undefined;
  };
  const customPageBg = detailStr("pageBg");

  useEffect(() => {
    if (!currentGuestName && invitee.firstName) {
      setGuestName(invitee.firstName);
    }
  }, [currentGuestName, invitee.firstName, setGuestName]);

  return (
    <EventThemeScope event={event}>
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: customPageBg ?? template.pageBg }}
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
                  subtitle: cardSubtitle,
                  logo:
                    (typeof event.details?.showLogo === "boolean"
                      ? event.details.showLogo
                      : Boolean(event.details?.logo)) &&
                    typeof event.details?.logo === "string"
                      ? event.details.logo
                      : undefined,
                  dateLabel:
                    formatDateRange(event, formatDateLabel) ?? undefined,
                  time:
                    typeof event.details?.time === "string" &&
                    event.details.time
                      ? t(
                          isDateRange(event)
                            ? "invitation__time__from"
                            : "invitation__time__at",
                          { time: event.details.time },
                        )
                      : undefined,
                  venue: event.locationName ?? event.venueName ?? undefined,
                  place: event.locationCity ?? event.venueCity ?? undefined,
                  message:
                    event.welcomeMessage ||
                    t(
                      `guest__welcome_default__${getEventTypeConfig(event.eventType).type}`,
                    ),
                  greeting:
                    typeof event.details?.greeting === "string"
                      ? event.details.greeting
                      : undefined,
                  age:
                    event.details?.showAge !== false &&
                    typeof event.details?.age === "number"
                      ? event.details.age
                      : undefined,
                }}
                guestFirstName={invitee.firstName}
                pageBg={customPageBg}
                cardBg={
                  typeof event.details?.cardBg === "string"
                    ? event.details.cardBg
                    : undefined
                }
                textColor={
                  typeof event.details?.textColor === "string"
                    ? event.details.textColor
                    : undefined
                }
                mutedColor={
                  typeof event.details?.mutedColor === "string"
                    ? event.details.mutedColor
                    : undefined
                }
                accentColor={
                  typeof event.details?.accentColor === "string"
                    ? event.details.accentColor
                    : undefined
                }
                textScale={
                  typeof event.details?.textScale === "number"
                    ? event.details.textScale
                    : undefined
                }
              />
            </div>

            {event.details?.showRsvp !== false &&
              getEventTypeConfig(event.eventType).features.rsvp && (
                <RsvpActions
                  slug={slug}
                  token={token}
                  invitee={invitee}
                  template={template}
                  pageBg={customPageBg}
                  textColor={detailStr("textColor")}
                  mutedColor={detailStr("mutedColor")}
                  accentColor={detailStr("accentColor")}
                />
              )}
          </div>
        </div>
      </div>
    </EventThemeScope>
  );
};
