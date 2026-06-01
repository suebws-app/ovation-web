import { useEffect } from "react";

export const useRedirectOnBackNavigation = (redirectUrl: string) => {
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const onPopState = () => {
      window.location.replace(redirectUrl);
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      setTimeout(() => window.removeEventListener("popstate", onPopState), 0);
    };
  }, [redirectUrl]);
};
