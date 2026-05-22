"use client";

import { useEffect, useState } from "react";
import { eventsClient } from "@/lib/api/events-client";

export const useSlugSuggestions = (
  partnerAName: string,
  partnerBName: string,
): string[] => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      eventsClient
        .slugSuggestions(
          {
            partnerAName: partnerAName.trim() || undefined,
            partnerBName: partnerBName.trim() || undefined,
          },
          controller.signal,
        )
        .then((res) => {
          if (!controller.signal.aborted) setSuggestions(res.suggestions);
        })
        .catch(() => {
          if (!controller.signal.aborted) setSuggestions([]);
        });
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [partnerAName, partnerBName]);

  return suggestions;
};
