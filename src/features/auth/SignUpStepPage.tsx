import { redirect } from "next/navigation";
import { SignUpFlow } from "@/features/auth/SignUp/SignUpFlow";

type SignUpStepPageProps = {
  params: Promise<{ step: string }>;
};

export const SignUpStepPage = async ({ params }: SignUpStepPageProps) => {
  const { step: stepParam } = await params;
  const step = parseInt(stepParam, 10);

  if (isNaN(step) || step < 1 || step > 7) {
    redirect("/sign-up");
  }

  return <SignUpFlow step={step} />;
};
