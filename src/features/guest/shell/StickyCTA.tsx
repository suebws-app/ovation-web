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
          "bg-card tablet:px-8 small-desktop:px-10 sticky bottom-0 z-10 px-5 pt-9 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-sm",
          className,
        )}
      >
        <div
          className={cn(
            "tablet:flex-row tablet:items-center flex flex-col-reverse gap-3",
            caption ? "tablet:justify-between" : "tablet:justify-end",
          )}
        >
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
        "bg-card tablet:px-8 small-desktop:px-10 sticky bottom-0 z-10 px-5 pt-9 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
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
