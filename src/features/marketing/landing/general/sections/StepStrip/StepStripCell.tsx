import { type ComponentType, type SVGProps } from "react";

type StepStripCellProps = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  text: string;
};

export const StepStripCell = ({ Icon, label, text }: StepStripCellProps) => (
  <div className="flex items-center gap-3">
    <span className="border-border text-foreground rounded-8 flex size-11 shrink-0 items-center justify-center border">
      <Icon className="size-6" aria-hidden />
    </span>
    <span className="flex flex-col">
      <span className="text-foreground type-body font-semibold">{label}</span>
      <span className="text-muted-foreground type-body-small desktop:whitespace-nowrap">
        {text}
      </span>
    </span>
  </div>
);
