"use client";

import { useEffect, useState } from "react";
import { eventsClient } from "@/lib/api/events-client";

type SlugSuggestionsResult = {
  suggestions: string[];
  isLoading: boolean;
};

export const useSlugSuggestions = (
  partnerAName: string,
  partnerBName: string,
): SlugSuggestionsResult => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setIsLoading(true);
      eventsClient
        .slugSuggestions(
          {
            partnerAName: partnerAName.trim() || undefined,
            partnerBName: partnerBName.trim() || undefined,
          },
          controller.signal,
        )
        .then((res) => {
          if (controller.signal.aborted) return;
          setSuggestions(res.suggestions);
          setIsLoading(false);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setSuggestions([]);
          setIsLoading(false);
        });
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [partnerAName, partnerBName]);

  return { suggestions, isLoading };
};
