"use client";

import { useTranslations } from "next-intl";
import type { Invitee, RsvpStatus } from "@/lib/api/types";

const STATUS_STYLES: Record<RsvpStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  accepted: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  declined: "bg-destructive/10 text-destructive",
};

type RsvpStatusChipProps = {
  invitee: Invitee;
};

export const RsvpStatusChip = ({ invitee }: RsvpStatusChipProps) => {
  const t = useTranslations();
  const status = invitee.rsvpStatus;
  const label =
    status === "accepted" && invitee.rsvpSeats
      ? `${t("invitees__rsvp__accepted")} ${t("invitees__rsvp__seats_suffix", {
          count: invitee.rsvpSeats,
        })}`
      : t(`invitees__rsvp__${status}`);
  return (
    <span
      title={invitee.rsvpNote ?? undefined}
      className={`type-caption rounded-full px-2.5 py-0.5 font-medium ${STATUS_STYLES[status]}`}
    >
      {label}
    </span>
  );
};
