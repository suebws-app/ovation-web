import type { ReactNode } from "react";
import { cn } from "@ovation/ui/utils/cn";

type StickyCTALayout = "stack" | "split";

type StickyCTAProps = {
  children: ReactNode;
  caption?: string;
  layout?: StickyCTALayout;
  className?: string;
};

export const StickyCTA = ({
  children,
  caption,
  layout = "stack",
  className,
}: StickyCTAProps) => {
  if (layout === "split") {
    return (
      <div
        className={cn(
          "from-background small-desktop:sticky small-desktop:bottom-0 tablet:px-8 small-desktop:px-10 z-10 bg-gradient-to-t to-transparent px-5 pt-9 pb-6",
          className,
        )}
      >
        <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col-reverse gap-3">
          {caption && (
            <p className="type-caption text-muted-foreground tablet:text-left text-center">
              {caption}
            </p>
          )}
          <div className="tablet:w-auto w-full">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "from-background small-desktop:sticky small-desktop:bottom-0 tablet:px-8 small-desktop:px-10 z-10 bg-gradient-to-t to-transparent px-5 pt-9 pb-6",
        className,
      )}
    >
      {children}
      {caption && (
        <p className="type-caption text-muted-foreground mt-2.5 text-center">
          {caption}
        </p>
      )}
    </div>
  );
};
