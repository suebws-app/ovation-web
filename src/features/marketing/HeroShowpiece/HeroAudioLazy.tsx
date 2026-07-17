"use client";

import dynamic from "next/dynamic";

const HeroAudio = dynamic(
  () => import("./HeroAudio").then((m) => ({ default: m.HeroAudio })),
  { ssr: false, loading: () => <div className="mt-4 h-11" /> },
);

export const HeroAudioLazy = () => <HeroAudio />;
