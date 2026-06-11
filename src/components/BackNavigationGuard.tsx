"use client";

import { useRedirectOnBackNavigation } from "@/lib/hooks/useRedirectOnBackNavigation";

type BackNavigationGuardProps = {
  redirectTo: string;
};

export const BackNavigationGuard = ({
  redirectTo,
}: BackNavigationGuardProps) => {
  useRedirectOnBackNavigation(redirectTo);
  return null;
};
