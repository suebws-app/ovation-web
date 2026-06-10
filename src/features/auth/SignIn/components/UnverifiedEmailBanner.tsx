"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth/client";

type Props = {
  email: string;
  onSent: () => void;
};

export const UnverifiedEmailBanner = ({ email, onSent }: Props) => {
  const t = useTranslations();
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setSending(true);
    await authClient.sendVerificationEmail({ email });
    setSending(false);
    onSent();
  };

  return (
    <div
      className="bg-warning/10 border-warning/30 rounded-8 mt-4 border p-3.5"
      role="alert"
    >
      <p className="type-body-small text-foreground font-medium">
        {t("auth__signin__unverified_title")}
      </p>
      <p className="type-caption text-muted-foreground mt-1">
        {t("auth__signin__unverified_hint")}
      </p>
      <button
        type="button"
        onClick={handleResend}
        disabled={sending}
        className="type-caption text-primary mt-2 cursor-pointer font-semibold disabled:opacity-50"
      >
        {sending
          ? t("auth__verify__sending")
          : t("auth__signin__unverified_resend")}
      </button>
    </div>
  );
};
