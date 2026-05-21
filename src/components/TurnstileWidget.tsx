"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { env } from "@/lib/utils/env";

type Props = {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
};

export const TurnstileWidget = ({ onSuccess, onExpire }: Props) => {
  if (!env.TURNSTILE_SITE_KEY) return null;

  return (
    <Turnstile
      siteKey={env.TURNSTILE_SITE_KEY}
      onSuccess={onSuccess}
      onExpire={onExpire}
      options={{ theme: "auto", size: "normal" }}
    />
  );
};
