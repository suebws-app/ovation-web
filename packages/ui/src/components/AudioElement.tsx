import { forwardRef } from "react";
import { cn } from "../utils/cn";

type AudioElementProps = Omit<React.ComponentProps<"audio">, "controls">;

export const AudioElement = forwardRef<HTMLAudioElement, AudioElementProps>(
  ({ className, ...rest }, ref) => (
    <audio ref={ref} className={cn("hidden", className)} {...rest} />
  ),
);

AudioElement.displayName = "AudioElement";
