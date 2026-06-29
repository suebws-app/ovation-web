"use client";

import type { UseFormReturn } from "react-hook-form";
import { INVITATION_STEPS, type InvitationStepId } from "./constants";
import type { InvitationFields } from "./invitationSchema";
import { useInvitationStore } from "./useInvitationStore";
import type { useSaveInvitationStep } from "./useSaveInvitationStep";

const STEP_FIELDS: Record<InvitationStepId, (keyof InvitationFields)[]> = {
  design: [],
  details: ["partnerA", "partnerB"],
  guests: ["guests"],
};

type UseInvitationStepNavigationArgs = {
  methods: UseFormReturn<InvitationFields>;
  save: ReturnType<typeof useSaveInvitationStep>["save"];
  onComplete?: () => void;
};

export const useInvitationStepNavigation = ({
  methods,
  save,
  onComplete,
}: UseInvitationStepNavigationArgs) => {
  const step = useInvitationStore((s) => s.step);
  const setStep = useInvitationStore((s) => s.setStep);

  const stepIdx = INVITATION_STEPS.indexOf(step);
  const isLastStep = stepIdx === INVITATION_STEPS.length - 1;

  const handleNext = async () => {
    const fields = STEP_FIELDS[step];
    if (fields.length > 0) {
      const ok = await methods.trigger(fields);
      if (!ok) return;
    }
    const result = await save(step, methods.getValues());
    if (!result.ok) return;
    if (isLastStep) {
      onComplete?.();
      return;
    }
    setStep(INVITATION_STEPS[stepIdx + 1]);
  };

  const handleBack = () => {
    if (stepIdx > 0) setStep(INVITATION_STEPS[stepIdx - 1]);
  };

  return {
    step,
    stepIdx,
    isLastStep,
    handleNext,
    handleBack,
  };
};
