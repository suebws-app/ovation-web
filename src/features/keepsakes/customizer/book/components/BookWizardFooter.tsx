"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Stepper } from "@ovation/ui/components/Stepper";
import { TOTAL_BOOK_STEPS } from "../bookSteps";

type BookWizardFooterProps = {
  stepIdx: number;
  isLastStep: boolean;
  nextDisabled?: boolean;
  onBack: () => void;
  onNext: () => void;
  onGoToCheckout: () => void;
};

export const BookWizardFooter = ({
  stepIdx,
  isLastStep,
  nextDisabled = false,
  onBack,
  onNext,
  onGoToCheckout,
}: BookWizardFooterProps) => {
  const t = useTranslations();

  return (
    <footer className="border-border bg-card tablet:px-8 desktop:left-(--sidebar-width) fixed right-0 bottom-0 left-0 z-20 flex items-center justify-end gap-3 border-t px-4 py-4">
      <div className="tablet:pointer-events-none tablet:absolute tablet:inset-x-0 tablet:flex tablet:justify-center">
        <Stepper currentStep={stepIdx + 1} totalSteps={TOTAL_BOOK_STEPS} />
      </div>
      <div className="relative flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={stepIdx === 0}
          className="rounded-full"
        >
          {t("keepsakes__book_customizer__nav__back")}
        </Button>
        <Button
          type="button"
          onClick={isLastStep ? onGoToCheckout : onNext}
          disabled={nextDisabled}
          className="shadow-primary/40 rounded-full shadow-md"
        >
          {isLastStep
            ? t("keepsakes__book_customizer__go_to_checkout")
            : t("keepsakes__book_customizer__nav__next")}
        </Button>
      </div>
    </footer>
  );
};
