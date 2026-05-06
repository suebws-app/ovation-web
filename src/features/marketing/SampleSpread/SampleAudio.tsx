"use client";
import { AudioWavePlayer } from "@ovation/ui/components/AudioWavePlayer";
import { useSharedAudioPlayer } from "@ovation/ui/providers/AudioPlayerProvider";

const SRC = "/sample2-audio.mp3";

export const SampleAudio = () => {
  const player = useSharedAudioPlayer();
  return (
    <AudioWavePlayer
      src={SRC}
      id={SRC}
      player={player}
      barCount={44}
      height={44}
      className="mt-4"
    />
  );
};
