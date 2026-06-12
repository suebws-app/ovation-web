"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { OtpInput } from "@ovation/ui/components/OtpInput";
import { useSignInStore } from "../useSignInStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { ShieldIcon } from "../components/ShieldIcon";
import { AuthScreen } from "../../components/AuthScreen";
import { AuthHeading } from "../../components/AuthHeading";

export const TwoFactorStep = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useSignInStore();
  const router = useRouter();

  return (
    <AuthScreen centered>
      <ShieldIcon />

      <div className="mt-5">
        <AuthHeading
          title={t("auth__signin__twofactor__title")}
          subtitle={t.rich("auth__signin__twofactor__body_full", {
            timer: (chunks) => (
              <strong className="text-destructive">{chunks}</strong>
            ),
          })}
        />
      </div>

      <OtpInput
        value={formData.otpCode}
        onChange={(value) => updateFormData({ otpCode: value })}
        className="mt-10"
      />

      <div className="type-body-small text-muted-foreground mt-6 flex items-center justify-center gap-3.5">
        <button
          type="button"
          className="text-primary cursor-pointer font-semibold"
        >
          {t("auth__signin__twofactor__resend")}
        </button>
        <span className="opacity-30">&middot;</span>
        <button
          type="button"
          className="text-primary cursor-pointer font-semibold"
        >
          {t("auth__signin__twofactor__use_email")}
        </button>
      </div>

      <Button
        onClick={() => router.push(appRoutes.auth.signInWelcome)}
        disabled={formData.otpCode.length < 6}
        size="lg"
        className="shadow-primary/40 mt-9 rounded-full px-10 shadow-md"
      >
        {t("auth__signin__twofactor__verify")}
      </Button>

      <p className="type-caption text-muted-foreground mt-11 font-serif italic">
        {t("auth__signin__twofactor__last_signin")}
      </p>
    </AuthScreen>
  );
};
