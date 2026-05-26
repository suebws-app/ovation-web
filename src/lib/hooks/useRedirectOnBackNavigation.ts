import { useEffect } from "react";

const stripLocale = (path: string) => path.replace(/^\/[a-z]{2}(?=\/|$)/, "");

export const useRedirectOnBackNavigation = (redirectUrl: string) => {
  useEffect(() => {
    const trapHref = window.location.href;
    const trapPath = stripLocale(window.location.pathname);
    const targetPath = stripLocale(
      new URL(redirectUrl, trapHref).pathname,
    );
    const sameRoute = trapPath === targetPath;

    window.history.pushState(null, "", trapHref);

    const onPopState = () => {
      if (stripLocale(window.location.pathname) === trapPath) {
        window.history.pushState(null, "", trapHref);
        return;
      }
      if (sameRoute) {
        window.history.pushState(null, "", trapHref);
        return;
      }
      window.location.replace(redirectUrl);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [redirectUrl]);
};
