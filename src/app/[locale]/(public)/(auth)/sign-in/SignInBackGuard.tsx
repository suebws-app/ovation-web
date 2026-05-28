"use client";

import { useLayoutEffect } from "react";

export function SignInBackGuard({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const onPopState = () => {
      window.history.go(1);
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return children;
}
