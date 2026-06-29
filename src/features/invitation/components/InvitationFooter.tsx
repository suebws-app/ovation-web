"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Stepper } from "@ovation/ui/components/Stepper";
import { TOTAL_INVITATION_STEPS } from "../constants";

type InvitationFooterProps = {
  stepIdx: number;
  isLastStep: boolean;
  isSaving: boolean;
  onBack: () => void;
  onNext: () => void;
};

export const InvitationFooter = ({
  stepIdx,
  isLastStep,
  isSaving,
  onBack,
  onNext,
}: InvitationFooterProps) => {
  const t = useTranslations();

  const nextLabel = isSaving
    ? t("invitation__saving")
    : isLastStep
      ? t("invitation__nav__complete")
      : t("invitation__nav__next");

  return (
    <footer className="border-border bg-card tablet:px-8 desktop:left-(--sidebar-width) fixed right-0 bottom-0 left-0 z-20 flex items-center justify-end gap-3 border-t px-4 py-4">
      <div className="tablet:pointer-events-none tablet:absolute tablet:inset-x-0 tablet:flex tablet:justify-center">
        <Stepper
          currentStep={stepIdx + 1}
          totalSteps={TOTAL_INVITATION_STEPS}
        />
      </div>
      <div className="relative flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={stepIdx === 0 || isSaving}
          className="rounded-full"
        >
          {t("invitation__nav__back")}
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={isSaving}
          className="shadow-primary/40 rounded-full shadow-md"
        >
          {nextLabel}
        </Button>
      </div>
    </footer>
  );
};
