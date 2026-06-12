import { AuthHeader } from "./AuthHeader";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col">
      <AuthHeader />
      <main className="tablet:px-20 tablet:gap-4 tablet:h-auto tablet:overflow-visible flex flex-1 flex-col items-center gap-2 overflow-y-auto px-5 py-4">
        {children}
      </main>
    </div>
  );
};
