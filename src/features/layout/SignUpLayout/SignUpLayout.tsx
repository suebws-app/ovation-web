import { SignUpHeader } from "./SignUpHeader";

export const SignUpLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-full w-full flex flex-col">
      <SignUpHeader />
      {children}
    </div>
  );
};
