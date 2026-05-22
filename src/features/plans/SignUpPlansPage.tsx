"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { CouplePlan } from "@/features/plans/CouplePlan";
import { ProPlan } from "@/features/plans/ProPlan";

type SignUpPlansPageProps = {
  initialAccountType?: "couple" | "pro" | null;
};

export const SignUpPlansPage = ({ initialAccountType }: SignUpPlansPageProps = {}) => {
  const { formData, updateFormData } = useSignUpStore();
  const searchParams = useSearchParams();
  const asParam = searchParams.get("as");

  useEffect(() => {
    if (asParam === "pro") updateFormData({ accountType: "pro" });
    else if (asParam === "couple") updateFormData({ accountType: "couple" });
    else if (initialAccountType && !formData.accountType) {
      updateFormData({ accountType: initialAccountType });
    }
  }, [asParam, initialAccountType, formData.accountType, updateFormData]);

  const accountType =
    asParam === "pro" || asParam === "couple"
      ? asParam
      : formData.accountType || initialAccountType || "";

  if (accountType === "pro") return <ProPlan />;
  return <CouplePlan />;
};
