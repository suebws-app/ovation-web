"use client";

import { useEffect, useState, startTransition } from "react";
import { eventsClient } from "@/lib/api/events-client";

export type SlugStatus =
  | "idle"
  | "invalid"
  | "checking"
  | "available"
  | "taken";

const SLUG_PATTERN = /^[a-z0-9-]{4,20}$/;

export const useSlugChecker = (slug: string): SlugStatus => {
  const [status, setStatus] = useState<SlugStatus>("idle");

  useEffect(() => {
    if (slug.length === 0) {
      startTransition(() => setStatus("idle"));
      return;
    }
    if (!SLUG_PATTERN.test(slug)) {
      startTransition(() => setStatus("invalid"));
      return;
    }
    startTransition(() => setStatus("checking"));
    const controller = new AbortController();
    const timer = setTimeout(() => {
      eventsClient
        .checkSlug(slug, controller.signal)
        .then((res) => {
          if (!controller.signal.aborted) {
            setStatus(res.available ? "available" : "taken");
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setStatus(
              process.env.NODE_ENV === "development" ? "available" : "idle",
            );
          }
        });
    }, 400);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [slug]);

  return status;
};
