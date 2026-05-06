"use client";
import { AudioWavePlayer } from "@ovation/ui/components/AudioWavePlayer";
import { useSharedAudioPlayer } from "@ovation/ui/providers/AudioPlayerProvider";

const SRC = "/sample-audio.mp3";

export const HeroAudio = () => {
  const player = useSharedAudioPlayer();
  return (
    <AudioWavePlayer
      src={SRC}
      id={SRC}
      player={player}
      barCount={44}
      height={44}
      className="mt-4"
      wave
    />
  );
};
