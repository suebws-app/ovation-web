import { cn } from "@ovation/ui/utils/cn";
import { Logo } from "@ovation/ui/components/Logo";

type AuthPageShellProps = {
  children: React.ReactNode;
  centered?: boolean;
};

export const AuthPageShell = ({
  children,
  centered = false,
}: AuthPageShellProps) => (
  <div className="tablet:px-20 mx-auto flex min-h-screen w-full max-w-130 flex-col px-6 py-12">
    <Logo />
    <div
      className={cn(
        "mt-16 flex flex-1 flex-col",
        centered && "items-center text-center",
      )}
    >
      {children}
    </div>
  </div>
);
