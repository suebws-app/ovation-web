"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { authClient } from "@/lib/auth/client";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { AuthScreen } from "@/features/auth/components/AuthScreen";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { MailIcon } from "@/features/verify/components/MailIcon";

type ResendState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  | { status: "error"; message: string };

export const VerifyPage = () => {
  const t = useTranslations();
  const email = useSignUpStore((s) => s.formData.email);
  const [resend, setResend] = useState<ResendState>({ status: "idle" });

  const handleResend = async () => {
    if (!email) return;
    setResend({ status: "sending" });
    const { error } = await authClient.sendVerificationEmail({ email });
    if (error) {
      setResend({
        status: "error",
        message: error.message ?? t("auth__verify__resend_error"),
      });
      return;
    }
    setResend({ status: "sent" });
  };

  return (
    <AuthScreen centered>
      <MailIcon />

      <AuthHeading
        eyebrow={t("auth__signup__eyebrow_step", {
          step: 2,
          label: t("auth__verify__step_label"),
        })}
        title={t("auth__verify__check_inbox")}
        subtitle={t.rich("auth__verify__sent_to", {
          email: () => (
            <strong className="text-foreground">
              {email || t("auth__verify__sent_to_fallback")}
            </strong>
          ),
        })}
      />

      <div className="type-body-small text-muted-foreground mt-9 flex items-center justify-center gap-3.5">
        {t("auth__verify__didnt_get")}{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resend.status === "sending" || !email}
          className="text-primary cursor-pointer font-semibold disabled:opacity-50"
        >
          {resend.status === "sending"
            ? t("auth__verify__sending")
            : t("auth__verify__send_again")}
        </button>
      </div>

      {resend.status === "sent" && (
        <p className="type-caption text-primary mt-4">
          {t("auth__verify__resent")}
        </p>
      )}
      {resend.status === "error" && (
        <p className="type-caption text-destructive mt-4" role="alert">
          {resend.message}
        </p>
      )}

      <p className="type-caption text-muted-foreground mt-11 font-serif italic">
        {t("auth__verify__tip")}
      </p>

      <Button asChild variant="ghost" size="sm" className="mt-6">
        <Link href={appRoutes.auth.plans}>
          {t("auth__verify__continue_anyway")}
        </Link>
      </Button>
    </AuthScreen>
  );
};
