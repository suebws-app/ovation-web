"use client";

import { CustomizerCheckoutForm } from "../CustomizerCheckoutForm";
import { type BookBinding } from "./BookFormContext";
import { useBookCheckoutData } from "./useBookCheckoutData";
import type {
  Event,
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type BookCheckoutPanelProps = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
  event?: Event | null;
  binding: BookBinding;
  isPro: boolean;
  hidePriceBreakdown?: boolean;
  bare?: boolean;
  onRegisterBuyNow?: (fn: (() => void) | null) => void;
};

export const BookCheckoutPanel = ({
  product,
  variants,
  eventId,
  event,
  binding,
  isPro,
  hidePriceBreakdown = false,
  bare = false,
  onRegisterBuyNow,
}: BookCheckoutPanelProps) => {
  const {
    selectedVariant,
    priceBreakdown,
    unitPriceCents,
    customization,
    photoIds,
    photoSelectAll,
    isReady,
    notReadyMessage,
  } = useBookCheckoutData(variants, eventId, binding);

  return (
    <CustomizerCheckoutForm
      product={product}
      eventId={eventId}
      event={event}
      customization={customization}
      photoIds={photoIds}
      photoSelectAll={photoSelectAll}
      selectedVariant={selectedVariant}
      isReady={isReady}
      notReadyMessage={notReadyMessage}
      showEventBadge={isPro}
      unitPriceCents={unitPriceCents}
      priceBreakdown={priceBreakdown}
      hidePriceBreakdown={hidePriceBreakdown}
      bare={bare}
      onRegisterBuyNow={onRegisterBuyNow}
    />
  );
};
