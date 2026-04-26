import { Play } from "@ovation/icons/Play";
import { Pause } from "@ovation/icons/Pause";

type MessagePlayButtonProps = {
  playing?: boolean;
};

export const MessagePlayButton = ({ playing }: MessagePlayButtonProps) => (
  <div
    className={`flex size-9 items-center justify-center rounded-full ${
      playing
        ? "bg-destructive text-primary-foreground shadow-[0_0_0_4px_oklch(0.723_0.135_40/0.15)]"
        : "border-border bg-card text-foreground border"
    }`}
  >
    {playing ? (
      <Pause width={13} height={13} />
    ) : (
      <Play width={13} height={13} />
    )}
  </div>
);
