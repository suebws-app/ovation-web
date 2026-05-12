import { SignInForm } from "./SignInForm";
import { SignInBrandPanel } from "../components/SignInBrandPanel";

export const SignInFormStep = () => (
  <div className="desktop:grid-cols-2 grid min-h-screen">
    <SignInForm />
    <SignInBrandPanel />
  </div>
);
