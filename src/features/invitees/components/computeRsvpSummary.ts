import type { Invitee, RsvpStatus } from "@/lib/api/types";

export type RsvpBucket = { heads: number; entries: number; pct: number };

export type RsvpSummary = {
  coming: RsvpBucket;
  declined: RsvpBucket;
  notAnswered: RsvpBucket;
  totalHeads: number;
  totalEntries: number;
  invitedHeads: number;
};

const BUCKET_BY_STATUS: Record<
  RsvpStatus,
  "coming" | "declined" | "notAnswered"
> = {
  accepted: "coming",
  declined: "declined",
  pending: "notAnswered",
};

export const computeRsvpSummary = (invitees: Invitee[]): RsvpSummary => {
  const acc = {
    coming: { heads: 0, entries: 0 },
    declined: { heads: 0, entries: 0 },
    notAnswered: { heads: 0, entries: 0 },
  };
  let invitedHeads = 0;

  for (const invitee of invitees) {
    invitedHeads += invitee.seats;
    const bucket = acc[BUCKET_BY_STATUS[invitee.rsvpStatus]];
    const heads =
      invitee.rsvpStatus === "accepted"
        ? (invitee.rsvpSeats ?? invitee.seats)
        : invitee.seats;
    bucket.heads += heads;
    bucket.entries += 1;
  }

  const totalHeads =
    acc.coming.heads + acc.declined.heads + acc.notAnswered.heads;
  const pct = (heads: number) =>
    totalHeads === 0 ? 0 : Math.round((heads / totalHeads) * 100);

  return {
    coming: { ...acc.coming, pct: pct(acc.coming.heads) },
    declined: { ...acc.declined, pct: pct(acc.declined.heads) },
    notAnswered: { ...acc.notAnswered, pct: pct(acc.notAnswered.heads) },
    totalHeads,
    totalEntries: invitees.length,
    invitedHeads,
  };
};
