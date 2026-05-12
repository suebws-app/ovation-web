"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { CoverPhotoForm } from "@/features/events/CoverPhotoForm";
import { useSignUpStore } from "../useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const CoverPhotoStep = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useSignUpStore();
  const router = useRouter();

  return (
    <CoverPhotoForm
      partner1Name={formData.partner1Name}
      partner2Name={formData.partner2Name}
      weddingDate={formData.weddingDate}
      venue={formData.venue}
      coverType={formData.coverType}
      coverFile={formData.coverFile}
      coverFilePreview={formData.coverFilePreview}
      onCoverChange={(coverType, coverFile, coverFilePreview) =>
        updateFormData({ coverType, coverFile, coverFilePreview })
      }
      onContinue={() => router.push(appRoutes.auth.signUpUrl)}
      headerSlot={
        <Kicker className="text-primary mb-3">
          {t("auth__signup__eyebrow_step", {
            step: 3,
            label: t("signup__cover__step_label"),
          })}
        </Kicker>
      }
      className="min-h-[calc(100vh-89px)]"
    />
  );
};
