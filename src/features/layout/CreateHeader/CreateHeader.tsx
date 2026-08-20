"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@ovation/ui/components/Logo";
import { Stepper } from "@ovation/ui/components/Stepper";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

const TOTAL_STEPS = 3;

const useCreateStep = (): number => {
  const pathname = usePathname();
  if (pathname.endsWith("/cover")) return 3;
  if (pathname.endsWith("/details")) return 2;
  return 1;
};

export const CreateHeader = () => {
  const step = useCreateStep();

  return (
    <header className="border-border tablet:px-8 relative flex items-center justify-between gap-3 border-b px-3 py-4">
      <Link href={appRoutes.home}>
        <Logo />
      </Link>
      <div className="tablet:pointer-events-none tablet:absolute tablet:inset-x-0 tablet:flex tablet:justify-center">
        <Stepper currentStep={step} totalSteps={TOTAL_STEPS} />
      </div>
    </header>
  );
};
