"use client";

import { useEffect } from "react";

const COOKIE_NAME = "ovation_last_event_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type LastEventCookieSyncProps = {
  eventId: string;
};

export const LastEventCookieSync = ({ eventId }: LastEventCookieSyncProps) => {
  useEffect(() => {
    document.cookie = `${COOKIE_NAME}=${eventId}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
  }, [eventId]);
  return null;
};
