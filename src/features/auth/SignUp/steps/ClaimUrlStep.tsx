"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { ClaimUrlForm } from "@/features/events/ClaimUrlForm";
import { useSignUpStore } from "../useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const ClaimUrlStep = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useSignUpStore();
  const router = useRouter();

  return (
    <ClaimUrlForm
      partner1Name={formData.partner1Name}
      partner2Name={formData.partner2Name}
      weddingDate={formData.weddingDate}
      venue={formData.venue}
      bookUrl={formData.bookUrl}
      onBookUrlChange={(url) => updateFormData({ bookUrl: url })}
      onContinue={() => {
        const accountType = formData.accountType || "couple";
        router.push(`${appRoutes.auth.signUp}?as=${accountType}`);
      }}
      headerSlot={
        <Kicker className="text-primary mb-3">
          {t("auth__signup__eyebrow_step", {
            step: 4,
            label: t("signup__claim__step_label"),
          })}
        </Kicker>
      }
      className="min-h-[calc(100vh-89px)]"
    />
  );
};
