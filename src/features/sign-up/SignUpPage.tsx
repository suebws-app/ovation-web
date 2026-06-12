import { Suspense } from "react";
import { SignUpForm } from "@/features/sign-up/SignUpForm";
import { SignUpFormSkeleton } from "@/features/sign-up/skeletons/SignUpFormSkeleton";

export const SignUpPage = () => (
  <Suspense fallback={<SignUpFormSkeleton />}>
    <SignUpForm />
  </Suspense>
);
