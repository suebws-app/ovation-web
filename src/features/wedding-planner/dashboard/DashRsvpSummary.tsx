"use client";

import { useInvitees } from "@/lib/query/inviteesQueries";
import { RsvpSummary } from "@/features/invitees/components/RsvpSummary";

type DashRsvpSummaryProps = {
  eventId: string;
};

export const DashRsvpSummary = ({ eventId }: DashRsvpSummaryProps) => {
  const { data: invitees = [], isLoading, isError } = useInvitees(eventId);
  if (isLoading || isError) return null;
  return <RsvpSummary invitees={invitees} className="shadow-sm" />;
};
