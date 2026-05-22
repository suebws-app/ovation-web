"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@ovation/ui/components/Logo";
import { Stepper } from "@ovation/ui/components/Stepper";

const TOTAL_STEPS = 2;

const useCreateStep = (): number => {
  const pathname = usePathname();
  if (pathname.endsWith("/cover")) return 2;
  return 1;
};

export const CreateHeader = () => {
  const step = useCreateStep();

  return (
    <header className="border-border tablet:px-14 relative flex items-center border-b px-6 py-7">
      <Logo />
      <div className="pointer-events-none absolute inset-x-0 flex justify-center">
        <Stepper currentStep={step} totalSteps={TOTAL_STEPS} />
      </div>
    </header>
  );
};
