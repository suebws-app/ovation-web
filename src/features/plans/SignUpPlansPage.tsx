"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { CouplePlan } from "@/features/plans/CouplePlan";
import { ProPlan } from "@/features/plans/ProPlan";
import { useRedirectOnBackNavigation } from "@/lib/hooks/useRedirectOnBackNavigation";
import {
  isConsumerRole,
  isProRole,
  normalizeAccountType,
} from "@/lib/auth/account-role";
import { appRoutes } from "@/lib/routes";

export const SignUpPlansPage = () => {
  const { formData, updateFormData } = useSignUpStore();
  const searchParams = useSearchParams();
  const asParam = searchParams.get("as");
  const hasRoleParam = isProRole(asParam) || isConsumerRole(asParam);

  useEffect(() => {
    if (hasRoleParam) {
      updateFormData({ accountType: normalizeAccountType(asParam) });
    }
  }, [asParam, hasRoleParam, updateFormData]);

  useRedirectOnBackNavigation(appRoutes.app.root);

  const accountType = hasRoleParam
    ? normalizeAccountType(asParam)
    : formData.accountType;

  if (accountType === "pro") return <ProPlan />;
  return <CouplePlan />;
};
