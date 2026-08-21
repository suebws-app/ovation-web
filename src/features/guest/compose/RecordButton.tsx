"use client";

import { MicIcon } from "@ovation/icons/MicIcon";
import { StopIcon } from "@ovation/icons/StopIcon";
import { cn } from "@ovation/ui/utils/cn";

type RecordButtonProps = {
  isRecording: boolean;
  isRequesting: boolean;
  label: string;
  onClick: () => void;
};

export const RecordButton = ({
  isRecording,
  isRequesting,
  label,
  onClick,
}: RecordButtonProps) => (
  <span className="relative flex size-20 items-center justify-center">
    {isRecording && (
      <span
        aria-hidden
        className="bg-destructive/25 absolute inset-0 animate-ping rounded-full"
      />
    )}
    <button
      type="button"
      onClick={onClick}
      disabled={isRequesting}
      aria-label={label}
      className={cn(
        "relative flex size-20 cursor-pointer items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-95 disabled:cursor-wait disabled:opacity-70",
        isRecording ? "bg-destructive" : "bg-primary",
      )}
    >
      {isRecording ? (
        <StopIcon width={26} height={26} aria-hidden />
      ) : (
        <MicIcon width={28} height={28} aria-hidden />
      )}
    </button>
  </span>
);
