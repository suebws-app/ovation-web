import { SignInForm } from "./SignInForm";
import { SignInBrandPanel } from "../components/SignInBrandPanel";

type SignInFormStepProps = {
  initialFailCount: number;
};

export const SignInFormStep = ({ initialFailCount }: SignInFormStepProps) => (
  <div className="desktop:grid-cols-2 grid min-h-screen">
    <SignInForm initialFailCount={initialFailCount} />
    <SignInBrandPanel />
  </div>
);
