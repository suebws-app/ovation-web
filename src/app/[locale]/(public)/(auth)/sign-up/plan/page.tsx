import { getCurrentUser } from "@/lib/auth/session";
import { ChoosePlanStep } from "@/features/auth/SignUp/steps/ChoosePlanStep";

export default async function SignUpPlanPage() {
  const user = await getCurrentUser();
  const initialAccountType =
    user?.accountType === "pro" || user?.accountType === "couple"
      ? user.accountType
      : null;
  return <ChoosePlanStep initialAccountType={initialAccountType} />;
}
