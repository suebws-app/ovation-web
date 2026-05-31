"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { env } from "@/lib/utils/env";

type Props = {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  resetKey?: number;
};

export const TurnstileWidget = ({ onSuccess, onExpire, resetKey }: Props) => {
  if (!env.TURNSTILE_SITE_KEY) return null;

  return (
    <div className="flex justify-center">
      <Turnstile
        key={resetKey ?? 0}
        siteKey={env.TURNSTILE_SITE_KEY}
        onSuccess={onSuccess}
        onExpire={onExpire}
        options={{ theme: "auto", size: "normal" }}
      />
    </div>
  );
};
