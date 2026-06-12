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
    <header className="border-border tablet:px-8 relative flex items-center justify-between gap-3 border-b px-3 py-4">
      <Logo />
      <div className="tablet:pointer-events-none tablet:absolute tablet:inset-x-0 tablet:flex tablet:justify-center">
        <Stepper currentStep={step} totalSteps={TOTAL_STEPS} />
      </div>
    </header>
  );
};
