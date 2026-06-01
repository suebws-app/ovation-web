import { SignInForm } from "./SignInForm";
import { SignInBrandPanel } from "../components/SignInBrandPanel";

type SignInFormStepProps = {
  initialFailCount: number;
};

export const SignInFormStep = ({ initialFailCount }: SignInFormStepProps) => (
  <div className="desktop:grid-cols-2 desktop:min-h-screen desktop:h-auto desktop:overflow-visible grid h-svh overflow-hidden">
    <SignInForm initialFailCount={initialFailCount} />
    <SignInBrandPanel />
  </div>
);
