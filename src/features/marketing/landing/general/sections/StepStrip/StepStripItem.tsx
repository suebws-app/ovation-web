import { type ComponentType, type SVGProps } from "react";
import { CurveArrowIcon } from "@ovation/icons/CurveArrowIcon";
import { StepStripCell } from "./StepStripCell";

type StepStripItemProps = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  text: string;
  showConnector: boolean;
};

export const StepStripItem = ({
  Icon,
  label,
  text,
  showConnector,
}: StepStripItemProps) => (
  <div className="tablet:gap-6 flex items-center justify-start gap-4">
    <StepStripCell Icon={Icon} label={label} text={text} />
    {showConnector && (
      <CurveArrowIcon
        className="text-muted-foreground tablet:block hidden h-7 w-14 shrink-0"
        aria-hidden
      />
    )}
  </div>
);
