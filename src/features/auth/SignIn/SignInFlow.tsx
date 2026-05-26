import { SignInFormStep } from "./steps/SignInFormStep";
import { TwoFactorStep } from "./steps/TwoFactorStep";
import { WelcomeBackStep } from "./steps/WelcomeBackStep";

type SignInFlowProps = {
  step: string;
  initialFailCount?: number;
};

export const SignInFlow = ({ step, initialFailCount = 0 }: SignInFlowProps) => {
  if (step === "verify") return <TwoFactorStep />;
  if (step === "welcome") return <WelcomeBackStep />;
  return <SignInFormStep initialFailCount={initialFailCount} />;
};
