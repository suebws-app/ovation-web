import { cn } from "@ovation/ui/utils/cn";

type WizardContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Wider variant for grid-based steps like the event-type picker. */
  wide?: boolean;
};

/**
 * Shared centered container for the create-wizard steps (type / role /
 * details), giving every step consistent max-width, horizontal padding, and
 * vertical rhythm under the signed-out CreateHeader layout.
 */
export const WizardContainer = ({
  children,
  className,
  wide,
}: WizardContainerProps) => (
  <div className="tablet:px-8 flex w-full flex-1 justify-center px-4 py-8">
    <div
      className={cn(
        "flex w-full flex-col gap-6",
        wide ? "max-w-2xl" : "max-w-130",
        className,
      )}
    >
      {children}
    </div>
  </div>
);
