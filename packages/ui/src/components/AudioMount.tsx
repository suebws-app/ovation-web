"use client";

import type { AudioPlayer } from "../hooks/useAudioPlayer";
import { AudioElement } from "./AudioElement";

type AudioMountProps = {
  player: AudioPlayer;
  className?: string;
};

export const AudioMount = ({ player, className }: AudioMountProps) => (
  <AudioElement player={player} className={className} />
);
