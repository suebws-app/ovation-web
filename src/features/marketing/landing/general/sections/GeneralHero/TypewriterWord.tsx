"use client";

import { useEffect, useState } from "react";
import {
  TYPEWRITER_DELETE_MS,
  TYPEWRITER_HOLD_MS,
  TYPEWRITER_TYPE_MS,
} from "./constants";

type TypewriterPhase = "typing" | "holding" | "deleting";

type TypewriterState = {
  wordIndex: number;
  charCount: number;
  phase: TypewriterPhase;
};

type TypewriterWordProps = {
  words: string[];
};

const PHASE_DELAYS: Record<TypewriterPhase, number> = {
  typing: TYPEWRITER_TYPE_MS,
  holding: TYPEWRITER_HOLD_MS,
  deleting: TYPEWRITER_DELETE_MS,
};

const nextState = (
  { wordIndex, charCount, phase }: TypewriterState,
  words: string[],
): TypewriterState => {
  if (phase === "holding") {
    return { wordIndex, charCount, phase: "deleting" };
  }

  if (phase === "deleting") {
    if (charCount > 0) {
      return { wordIndex, charCount: charCount - 1, phase: "deleting" };
    }
    return {
      wordIndex: (wordIndex + 1) % words.length,
      charCount: 0,
      phase: "typing",
    };
  }

  const wordLength = words[wordIndex]?.length ?? 0;
  if (charCount < wordLength) {
    return { wordIndex, charCount: charCount + 1, phase: "typing" };
  }
  return { wordIndex, charCount, phase: "holding" };
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const TypewriterWord = ({ words }: TypewriterWordProps) => {
  const [state, setState] = useState<TypewriterState>({
    wordIndex: 0,
    charCount: words[0]?.length ?? 0,
    phase: "holding",
  });

  useEffect(() => {
    if (words.length < 2 || prefersReducedMotion()) return;

    const timer = setTimeout(() => {
      setState((current) => nextState(current, words));
    }, PHASE_DELAYS[state.phase]);

    return () => clearTimeout(timer);
  }, [state, words]);

  const activeWord = words[state.wordIndex] ?? "";

  return (
    <span aria-live="polite" className="text-primary whitespace-nowrap">
      {activeWord.slice(0, state.charCount)}
      <span className="ov-typewriter-caret bg-primary ml-1" />
    </span>
  );
};
