"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const COOKIE_NAME = "ovation_ref";
const COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

const hasExistingCookie = (): boolean =>
  document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${COOKIE_NAME}=`));

export const ReferralCapture = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;
    if (hasExistingCookie()) return;

    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(ref)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
    trackEvent("referral_visit_captured", { ref });
  }, [searchParams]);

  return null;
};
