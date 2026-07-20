"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { BOOK_STEPS } from "./bookSteps";
import type { BookFormValues } from "./BookFormContext";
import { useBookStore } from "./useBookStore";

const STEP_FIELDS: Record<
  (typeof BOOK_STEPS)[number],
  (keyof BookFormValues)[]
> = {
  photos: [],
  format: ["paperType", "sizeKey"],
  cover: ["coverTemplateId"],
};

type UseBookStepNavigationArgs = {
  methods: UseFormReturn<BookFormValues>;
  // Whether the book meets checkout requirements (variant matched, pages within
  // min/max, photos chosen). Gates the Cover → Checkout advance.
  canCheckout: boolean;
};

export const useBookStepNavigation = ({
  methods,
  canCheckout,
}: UseBookStepNavigationArgs) => {
  const step = useBookStore((s) => s.step);
  const setStep = useBookStore((s) => s.setStep);
  const [photosError, setPhotosError] = useState(false);

  const stepIdx = BOOK_STEPS.indexOf(step);
  const isLastStep = stepIdx === BOOK_STEPS.length - 1;

  // Photos → Cover needs the photo count within the book's min/max; Cover →
  // Checkout needs full readiness. Both are covered by `canCheckout`
  // (variant matched + pages within range + at least one photo).
  const nextDisabled = (step === "photos" || step === "cover") && !canCheckout;

  const handleNext = async () => {
    if (step === "photos") {
      const values = methods.getValues();
      const hasPhotos =
        (values.photoIds?.length ?? 0) > 0 || Boolean(values.photoSelectAll);
      if (!hasPhotos) {
        setPhotosError(true);
        return;
      }
      // Enough photos chosen but count outside the allowed page range.
      if (!canCheckout) return;
    } else {
      const fields = STEP_FIELDS[step];
      if (fields.length > 0 && !(await methods.trigger(fields))) return;
      if (step === "cover" && !canCheckout) return;
    }
    setPhotosError(false);
    if (!isLastStep) setStep(BOOK_STEPS[stepIdx + 1]);
  };

  const handleBack = () => {
    setPhotosError(false);
    if (stepIdx > 0) setStep(BOOK_STEPS[stepIdx - 1]);
  };

  return {
    step,
    stepIdx,
    isLastStep,
    handleNext,
    handleBack,
    photosError,
    nextDisabled,
  };
};
