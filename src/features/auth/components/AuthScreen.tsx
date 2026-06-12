import { cn } from "@ovation/ui/utils/cn";

type AuthScreenProps = {
  children: React.ReactNode;
  footnote?: React.ReactNode;
  centered?: boolean;
  className?: string;
};

export const AuthScreen = ({
  children,
  footnote,
  centered = false,
  className,
}: AuthScreenProps) => (
  <>
    <div
      className={cn(
        "tablet:p-10 flex w-full max-w-110 flex-1 flex-col justify-center p-4",
        centered && "items-center text-center",
        className,
      )}
    >
      {children}
      {footnote && (
        <p className="type-caption text-muted-foreground/60 mx-auto mt-4">
          {footnote}
        </p>
      )}
    </div>
  </>
);
