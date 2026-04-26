import { cn } from "@ovation/ui/utils/cn";

type WaveformBarProps = {
  height: number;
  filled: boolean;
};

export const WaveformBar = ({ height, filled }: WaveformBarProps) => (
  <span
    className={cn(
      "w-[2.5px] rounded-full transition-colors",
      filled ? "bg-primary" : "bg-primary/20",
    )}
    style={{ height }}
  />
);
