"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Logo } from "@ovation/ui/components/Logo";
import { Stepper } from "@ovation/ui/components/Stepper";

const STEP_BY_SEGMENT: Record<string, number> = {
  book: 1,
  cover: 2,
  url: 2,
};

const TOTAL_STEPS = 3;

const useSignUpStep = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const segment = pathname.split("/").pop() ?? "";
  if (segment === "sign-up") {
    return searchParams.get("as") ? 3 : null;
  }
  return STEP_BY_SEGMENT[segment] ?? null;
};

export const SignUpHeader = () => {
  const step = useSignUpStep();

  return (
    <header className="border-border tablet:px-14 relative flex items-center border-b px-6 py-7">
      <Logo />
      {step !== null && (
        <div className="pointer-events-none absolute inset-x-0 flex justify-center">
          <Stepper currentStep={step} totalSteps={TOTAL_STEPS} />
        </div>
      )}
    </header>
  );
};
