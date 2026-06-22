"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@ovation/ui/utils/cn";
import { useNavProgressStore } from "./store";

const SAFETY_TIMEOUT_MS = 8000;

const shouldStartFromAnchorClick = (event: MouseEvent): boolean => {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return false;
  const target = event.target;
  if (!(target instanceof Element)) return false;
  const link = target.closest("a");
  if (!link) return false;
  if (link.target === "_blank") return false;
  const href = link.getAttribute("href");
  if (!href) return false;
  if (
    href.startsWith("#") ||
    href.startsWith("javascript:") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  )
    return false;
  let url: URL;
  try {
    url = new URL(link.href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  if (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  )
    return false;
  return true;
};

export const NavigationProgress = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pending = useNavProgressStore((s) => s.pending);
  const start = useNavProgressStore((s) => s.start);
  const end = useNavProgressStore((s) => s.end);

  useEffect(() => {
    end();
  }, [pathname, searchParams, end]);

  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(end, SAFETY_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [pending, end]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (shouldStartFromAnchorClick(event)) start();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [start]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 transition-opacity",
        pending ? "opacity-100 duration-100" : "opacity-0 duration-300",
      )}
    >
      <div className="bg-primary h-full origin-left animate-pulse" />
    </div>
  );
};
