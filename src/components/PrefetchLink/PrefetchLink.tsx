"use client";

import { useCallback, useRef, type ComponentProps } from "react";
import { Link, useRouter } from "@/i18n/navigation";

type PrefetchLinkProps = ComponentProps<typeof Link>;

const prefetched = new Set<string>();

export const PrefetchLink = (props: PrefetchLinkProps) => {
  const router = useRouter();
  const fired = useRef(false);

  const handlePrefetch = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    const href =
      typeof props.href === "string" ? props.href : JSON.stringify(props.href);
    if (prefetched.has(href)) return;
    prefetched.add(href);
    try {
      router.prefetch(
        props.href as unknown as Parameters<typeof router.prefetch>[0],
      );
    } catch {
      /* noop */
    }
  }, [props.href, router]);

  return (
    <Link
      {...props}
      onMouseEnter={(event) => {
        handlePrefetch();
        props.onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        handlePrefetch();
        props.onFocus?.(event);
      }}
    />
  );
};
