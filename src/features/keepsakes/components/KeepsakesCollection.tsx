"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";

import { decorate } from "../designTokens";
import { matchesFilter } from "../filterMap";
import { FilterTabs, type KeepsakeFilter } from "./FilterTabs";
import { ProductCard } from "./ProductCard";
import type { KeepsakeProduct } from "@/lib/api/types";

type KeepsakesCollectionProps = {
  products: KeepsakeProduct[];
  eventId: string | null;
};

export const KeepsakesCollection = ({
  products,
  eventId,
}: KeepsakesCollectionProps) => {
  const t = useTranslations();
  const [filter, setFilter] = useState<KeepsakeFilter>("all");

  const filtered = useMemo(
    () =>
      products
        .filter((product) => matchesFilter(product.productType, filter))
        .map(decorate),
    [products, filter],
  );

  return (
    <div className="mt-9">
      <div className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col gap-4.5">
        <div>
          <Kicker className="text-muted-foreground">
            {t("keepsakes__collection__eyebrow")}
          </Kicker>
          <h2 className="type-h2 mt-1.5 font-semibold tracking-tight">
            {t("keepsakes__collection__title")}
          </h2>
        </div>
        <FilterTabs active={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <p className="type-body-small text-muted-foreground mt-6">
          {t("keepsakes__collection__empty")}
        </p>
      ) : (
        <div className="tablet:grid-cols-2 desktop:grid-cols-3 mt-4.5 grid gap-4.5">
          {filtered.map((product) => (
            <ProductCard
              key={product.productType}
              product={product}
              eventId={eventId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
