"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { formatPrice, type DesignedProduct } from "../designTokens";
import { OrderModal } from "./OrderModal";
import { FeaturePill } from "./FeaturePill";
import { BookMock } from "./BookMock";

type FeaturedProductProps = {
  product: DesignedProduct;
  eventId: string | null;
};

export const FeaturedProduct = ({ product, eventId }: FeaturedProductProps) => {
  const t = useTranslations();
  const { name, description, priceCents, currency, timelineDays, design } =
    product;
  const [showOrder, setShowOrder] = useState(false);
  const canOrder = Boolean(eventId);

  const features = [
    t("keepsakes__featured__feature_pages"),
    t("keepsakes__featured__feature_qr"),
    t("keepsakes__featured__feature_linen"),
  ];

  return (
    <>
      <div
        className="rounded-24 tablet:p-8 desktop:grid-cols-[1fr_360px] relative grid items-center gap-7 overflow-hidden p-6"
        style={{ background: design.gradient }}
      >
        <span className="type-overline absolute top-5 right-6 tracking-[2px] text-black/55">
          {t("keepsakes__featured__most_ordered")}
        </span>
        <div>
          <Eyebrow className="tracking-[2px] text-black/55">
            {name} &middot; {formatPrice(priceCents, currency)}
          </Eyebrow>
          <h2 className="tablet:type-h1 type-h1 mt-2 font-serif leading-none font-semibold">
            {t("keepsakes__featured__title_a")}
            <br />
            {t("keepsakes__featured__title_b")}
          </h2>
          <p className="type-body-small mt-3 max-w-105 leading-relaxed text-black/75">
            {t(design.taglineKey) || description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {features.map((b) => (
              <FeaturePill key={b} label={b} />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Button
              disabled={!canOrder}
              onClick={() => setShowOrder(true)}
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full"
            >
              {canOrder ? (
                <>
                  {t("keepsakes__featured__order_now")}{" "}
                  <ArrowRight width={13} height={13} />
                </>
              ) : (
                t("keepsakes__featured__create_event_first")
              )}
            </Button>
            {timelineDays && (
              <span className="type-caption text-black/65">
                {t("keepsakes__featured__ships_in", { days: timelineDays })}
              </span>
            )}
          </div>
        </div>
        <BookMock />
      </div>

      {showOrder && eventId && (
        <OrderModal
          product={product}
          eventId={eventId}
          onClose={() => setShowOrder(false)}
        />
      )}
    </>
  );
};
