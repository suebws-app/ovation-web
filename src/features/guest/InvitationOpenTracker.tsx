"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { publicClient } from "@/lib/api/public-client";
import { useGuestSubmissionStore } from "./store/useGuestSubmissionStore";

type InvitationOpenTrackerProps = {
  slug: string;
};

export const InvitationOpenTracker = ({ slug }: InvitationOpenTrackerProps) => {
  const searchParams = useSearchParams();
  const channel = searchParams.get("via");
  const token = searchParams.get("t");
  const setInviteToken = useGuestSubmissionStore((s) => s.setInviteToken);

  useEffect(() => {
    if (token) setInviteToken(token);
  }, [token, setInviteToken]);

  useEffect(() => {
    if (!channel && !token) return;
    publicClient.recordInvitationOpen(slug, channel, token).catch(() => {
      // analytics is fire-and-forget
    });
  }, [slug, channel, token]);

  return null;
};
