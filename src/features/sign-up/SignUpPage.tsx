import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Kicker } from "@ovation/ui/components/Kicker";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { ChecklistItem } from "@/features/sign-up/components/ChecklistItem";
import { SignUpForm } from "@/features/sign-up/SignUpForm";
import { SignUpFormSkeleton } from "@/features/sign-up/skeletons/SignUpFormSkeleton";

const SignUpPanel = async () => {
  const t = await getTranslations();
  const steps = [
    t("auth__signup__brand_step__create_account"),
    t("auth__signup__brand_step__name_book"),
    t("auth__signup__brand_step__cover_link"),
    t("auth__signup__brand_step__choose_plan"),
  ];

  return (
    <>
      <Kicker className="relative tracking-[2.5px] opacity-80">
        {t("auth__signup__brand_eyebrow")}
      </Kicker>
      <p className="relative font-serif text-5xl leading-tight font-medium tracking-tight">
        {t("auth__signup__brand_intro")}
      </p>
      <div className="relative flex flex-col gap-3.5">
        {steps.map((label, i) => (
          <ChecklistItem
            key={label}
            index={i + 1}
            label={label}
            active={i === 0}
          />
        ))}
      </div>
    </>
  );
};

export const SignUpPage = () => (
  <AuthSplitLayout panel={<SignUpPanel />}>
    <Suspense fallback={<SignUpFormSkeleton />}>
      <SignUpForm />
    </Suspense>
  </AuthSplitLayout>
);
