"use client";

import { useTranslations } from "next-intl";
import type { Invitee } from "@/lib/api/types";

type InviteeStatus = "not_sent" | "sent" | "opened" | "responded";

const deriveStatus = (invitee: Invitee): InviteeStatus => {
  if (invitee.lastRespondedAt) return "responded";
  if (invitee.lastOpenedAt) return "opened";
  if (invitee.lastSentAt) return "sent";
  return "not_sent";
};

const STATUS_STYLES: Record<InviteeStatus, string> = {
  not_sent: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  opened: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  responded: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

type InviteeStatusChipProps = {
  invitee: Invitee;
};

export const InviteeStatusChip = ({ invitee }: InviteeStatusChipProps) => {
  const t = useTranslations();
  const status = deriveStatus(invitee);
  return (
    <span
      className={`type-caption rounded-full px-2.5 py-0.5 font-medium ${STATUS_STYLES[status]}`}
    >
      {t(`invitees__status__${status}`)}
    </span>
  );
};
