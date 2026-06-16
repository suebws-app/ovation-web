"use client";

import { useQuery } from "@tanstack/react-query";
import {
  shippingClient,
  type ShippingQuoteBody,
} from "@/lib/api/shipping-client";
import { queryKeys } from "./keys";

export const useShippingCountries = (variantIds: string[]) =>
  useQuery({
    queryKey: queryKeys.shipping.countries(variantIds),
    queryFn: () => shippingClient.countries(variantIds),
    enabled: variantIds.length > 0,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

export const useShippingQuote = (
  input: ShippingQuoteBody | null,
  enabled = true,
) =>
  useQuery({
    queryKey: input
      ? queryKeys.shipping.quote(input)
      : ["shipping", "quote", "disabled"],
    queryFn: () => {
      if (!input) throw new Error("shipping quote called without input");
      return shippingClient.quote(input);
    },
    enabled: enabled && !!input && input.items.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
