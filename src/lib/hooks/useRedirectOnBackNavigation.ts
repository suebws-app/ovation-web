import { useEffect } from "react";

const SENTINEL_COUNT = 50;

export const useRedirectOnBackNavigation = (redirectUrl: string) => {
  useEffect(() => {
    const trapHref = window.location.href;
    const sameRoute =
      new URL(redirectUrl, trapHref).pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") ===
      window.location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

    for (let i = 0; i < SENTINEL_COUNT; i++) {
      window.history.pushState(null, "", trapHref);
    }

    const onPopState = () => {
      if (sameRoute) {
        for (let i = 0; i < SENTINEL_COUNT; i++) {
          window.history.pushState(null, "", trapHref);
        }
        return;
      }
      window.location.replace(redirectUrl);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [redirectUrl]);
};
