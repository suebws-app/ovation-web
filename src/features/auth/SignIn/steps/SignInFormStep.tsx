import { SignInForm } from "./SignInForm";

type SignInFormStepProps = {
  initialFailCount: number;
};

export const SignInFormStep = ({ initialFailCount }: SignInFormStepProps) => (
  <SignInForm initialFailCount={initialFailCount} />
);
