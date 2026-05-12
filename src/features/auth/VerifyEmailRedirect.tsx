"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const VerifyEmailRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "1") {
      router.replace(appRoutes.app.root);
    }
  }, [router]);

  return null;
};
