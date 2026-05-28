"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRedirectOnBackNavigation } from "@/lib/hooks/useRedirectOnBackNavigation";
import { appRoutes } from "@/lib/routes";

export function PlansBackGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useRedirectOnBackNavigation(appRoutes.app.root);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) router.refresh();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [router]);

  return children;
}
