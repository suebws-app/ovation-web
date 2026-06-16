"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@/components/Toaster";
import { appRoutes } from "@/lib/routes";

type CheckoutSuccessRedirectProps = {
  message: string;
  target?: string;
};

export const CheckoutSuccessRedirect = ({
  message,
  target = appRoutes.app.root,
}: CheckoutSuccessRedirectProps) => {
  const router = useRouter();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    toast.success(message);
    router.replace(target);
  }, [message, target, router]);

  return null;
};
