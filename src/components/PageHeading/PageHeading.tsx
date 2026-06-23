import type { ReactNode } from "react";
import { Kicker } from "@ovation/ui/components/Kicker";
import { cn } from "@ovation/ui/utils/cn";

type PageHeadingProps = {
  kicker?: ReactNode;
  children: ReactNode;
  className?: string;
  kickerClassName?: string;
};

export const PageHeading = ({
  kicker,
  children,
  className,
  kickerClassName,
}: PageHeadingProps) => (
  <>
    {kicker && (
      <Kicker className={cn("text-primary", kickerClassName)}>{kicker}</Kicker>
    )}
    <h1
      className={cn(
        "type-h1 leading-tight font-semibold tracking-tight",
        kicker && "mt-2",
        className,
      )}
    >
      {children}
    </h1>
  </>
);
