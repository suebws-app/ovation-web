"use client";

import { useEffect } from "react";
import { setCookie } from "@/lib/utils/cookies";

const COOKIE_NAME = "ovation_last_event_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type LastEventCookieSyncProps = {
  eventId: string;
};

export const LastEventCookieSync = ({ eventId }: LastEventCookieSyncProps) => {
  useEffect(() => {
    setCookie(COOKIE_NAME, eventId, { maxAge: COOKIE_MAX_AGE });
  }, [eventId]);
  return null;
};
