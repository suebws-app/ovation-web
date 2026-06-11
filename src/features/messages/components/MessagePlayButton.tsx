import { PlayIcon } from "@ovation/icons/PlayIcon";
import { PauseIcon } from "@ovation/icons/PauseIcon";

type MessagePlayButtonProps = {
  playing?: boolean;
};

export const MessagePlayButton = ({ playing }: MessagePlayButtonProps) => (
  <div
    className={`flex size-9 cursor-pointer items-center justify-center rounded-full transition-all duration-150 hover:scale-110 active:scale-95 ${
      playing
        ? "bg-destructive text-primary-foreground hover:bg-destructive/90 shadow-[0_0_0_4px_oklch(0.723_0.135_40/0.15)]"
        : "border-border bg-card text-foreground hover:bg-foreground hover:text-background hover:border-foreground border"
    }`}
  >
    {playing ? (
      <PauseIcon width={13} height={13} />
    ) : (
      <PlayIcon width={13} height={13} />
    )}
  </div>
);
