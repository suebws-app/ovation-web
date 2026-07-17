"use client";

import { useVisitorKeepsakePrice } from "../useVisitorPrices";

type KeepsakePriceProps = {
  productType: string;
  fallbackPrice: string;
};

export const KeepsakePrice = ({
  productType,
  fallbackPrice,
}: KeepsakePriceProps) => {
  const price = useVisitorKeepsakePrice(productType, fallbackPrice);
  return <>{price}</>;
};
