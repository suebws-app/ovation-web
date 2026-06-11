"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { clientEnv as env } from "@/lib/utils/env.client";

type Props = {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  resetKey?: number;
};

export const TurnstileWidget = ({ onSuccess, onExpire, resetKey }: Props) => {
  if (!env.TURNSTILE_SITE_KEY) return null;

  return (
    <div className="tablet:h-[65px] tablet:[&>div]:scale-100 flex h-[55px] justify-center overflow-hidden [&>div]:origin-top [&>div]:scale-[0.85]">
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
