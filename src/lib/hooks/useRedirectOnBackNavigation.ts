import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

export const useRedirectOnBackNavigation = (redirectUrl: string) => {
  const router = useRouter();

  useEffect(() => {
    const onPopState = () => {
      router.replace(redirectUrl);
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      setTimeout(() => window.removeEventListener("popstate", onPopState), 0);
    };
  }, [redirectUrl, router]);
};
