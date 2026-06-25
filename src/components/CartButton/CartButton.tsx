"use client";

import { useEffect, useState, startTransition } from "react";
import { useTranslations } from "next-intl";
import { CartIcon } from "@ovation/icons/CartIcon";
import { cn } from "@ovation/ui/utils/cn";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useCartStore } from "@/features/cart/store/useCartStore";

type CartButtonProps = {
  className?: string;
};

export const CartButton = ({ className }: CartButtonProps) => {
  const t = useTranslations();
  const cartCount = useCartStore((s) => s.itemCount());
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    startTransition(() => setHydrated(true));
  }, []);

  const visibleCount = hydrated ? cartCount : 0;

  return (
    <Link
      href={appRoutes.app.cart}
      aria-label={t("sidebar__cart", { count: visibleCount })}
      className={cn(
        "border-border bg-card text-foreground hover:bg-muted relative inline-flex size-9 items-center justify-center rounded-full border transition-colors",
        className,
      )}
    >
      <CartIcon width={16} height={16} />
      {visibleCount > 0 && (
        <span className="bg-primary text-primary-foreground type-overline absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 leading-none">
          {visibleCount > 99 ? "99+" : visibleCount}
        </span>
      )}
    </Link>
  );
};
