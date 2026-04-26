import { cn } from "@ovation/ui/utils/cn";
import { Check } from "@ovation/icons/Check";

type PhotoSelectIndicatorProps = {
  selected: boolean;
};

export const PhotoSelectIndicator = ({
  selected,
}: PhotoSelectIndicatorProps) => (
  <div
    className={cn(
      "absolute top-2 left-2 flex size-5.5 items-center justify-center rounded-full",
      selected ? "bg-secondary" : "border-2 border-white bg-white/75",
    )}
  >
    {selected && (
      <Check
        width={12}
        height={12}
        className="text-foreground"
        strokeWidth={2.5}
      />
    )}
  </div>
);
