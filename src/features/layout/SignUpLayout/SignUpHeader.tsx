"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@ovation/ui/components/Logo";
import { Stepper } from "@ovation/ui/components/Stepper";

const STEP_BY_SEGMENT: Record<string, number> = {
  "sign-up": 1,
  verify: 2,
  book: 3,
  cover: 4,
  url: 5,
  plan: 6,
  done: 7,
};

const TOTAL_STEPS = 7;

const useSignUpStep = () => {
  const pathname = usePathname();
  const segment = pathname.split("/").pop() ?? "";
  return STEP_BY_SEGMENT[segment] ?? 1;
};

export const SignUpHeader = () => {
  const step = useSignUpStep();

  return (
    <header className="border-border tablet:px-14 flex items-center justify-between border-b px-6 py-7">
      <Logo />
      <Stepper currentStep={step} totalSteps={TOTAL_STEPS} />
      <button
        type="button"
        className="type-body-small text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      >
        Save &amp; finish later
      </button>
    </header>
  );
};
