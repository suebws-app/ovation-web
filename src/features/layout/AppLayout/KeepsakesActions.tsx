"use client";

import { useEffect, useState, startTransition } from "react";
import { useTranslations } from "next-intl";
import { CartIcon } from "@ovation/icons/CartIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useCartStore } from "@/features/cart/store/useCartStore";

const formatCredit = (cents: number) =>
  cents > 0 ? `€${(cents / 100).toFixed(0)}` : null;

export const KeepsakesActions = () => {
  const t = useTranslations();
  const cartCount = useCartStore((s) => s.itemCount());
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    startTransition(() => setHydrated(true));
  }, []);
  const credit: string | null = formatCredit(0);

  return (
    <div className="flex items-center gap-3">
      {credit && (
        <span className="type-caption text-accent-foreground font-semibold">
          {t("sidebar__credit_available", { amount: credit })}
        </span>
      )}
      <Link
        href={appRoutes.app.cart}
        className="border-border bg-card type-caption text-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 font-semibold transition-colors"
      >
        <CartIcon width={14} height={14} />
        {t("sidebar__cart", { count: hydrated ? cartCount : 0 })}
      </Link>
    </div>
  );
};
