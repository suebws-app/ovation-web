"use client";

import { useEffect, useState } from "react";

const INTERACTION_EVENTS: (keyof WindowEventMap)[] = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
];

export const useDeferredMount = (idleFallbackMs = 10000): boolean => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    let done = false;
    const activate = () => {
      if (done) return;
      done = true;
      setMounted(true);
    };

    INTERACTION_EVENTS.forEach((eventName) =>
      window.addEventListener(eventName, activate, {
        once: true,
        passive: true,
      }),
    );
    const timer = window.setTimeout(activate, idleFallbackMs);

    return () => {
      INTERACTION_EVENTS.forEach((eventName) =>
        window.removeEventListener(eventName, activate),
      );
      window.clearTimeout(timer);
    };
  }, [idleFallbackMs, mounted]);

  return mounted;
};
