"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@/components/Toaster";
import { appRoutes } from "@/lib/routes";
import { useCartStore } from "@/features/cart/store/useCartStore";

type CheckoutSuccessRedirectProps = {
  message: string;
  target?: string;
  clearCart?: boolean;
};

export const CheckoutSuccessRedirect = ({
  message,
  target = appRoutes.app.root,
  clearCart = false,
}: CheckoutSuccessRedirectProps) => {
  const router = useRouter();
  const clear = useCartStore((s) => s.clear);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    if (clearCart) clear();
    toast.success(message);
    router.replace(target);
  }, [message, target, router, clearCart, clear]);

  return null;
};
