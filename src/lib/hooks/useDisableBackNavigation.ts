import { useLayoutEffect } from "react";
export const useDisableBackNavigation = () => {
  useLayoutEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const onPopState = () => {
      window.history.go(1);
      window.history.pushState(null, "", window.location.href); // re-arm for spam back
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
};
