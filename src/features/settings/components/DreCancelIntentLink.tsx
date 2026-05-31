"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { subscriptionsClient } from "@/lib/api/subscriptions-client";

type DreCancelIntentLinkProps = {
  label: string;
};

export const DreCancelIntentLink = ({ label }: DreCancelIntentLinkProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await subscriptionsClient.dreCancelIntent();
        router.refresh();
      } catch {
        // surfaced via toast in a follow-up; for now silently no-op
      }
    });
  };

  return (
    <button
      type="button"
      className="type-body-small text-muted-foreground hover:text-foreground underline disabled:opacity-50"
      disabled={pending}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};
