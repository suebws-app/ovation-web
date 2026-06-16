import { clientFetch } from "./client";

export type ShippingCountryState = {
  code: string;
  name: string;
};

export type ShippingCountry = {
  countryCode: string;
  countryName: string;
  states?: ShippingCountryState[];
};

export type ShippingCountriesResult = {
  countries: ShippingCountry[];
};

export type ShippingQuotedItem = {
  variantId: string;
  quantity: number;
  numberOfPages: number;
};

export type ShippingQuoteBody = {
  countryCode: string;
  state?: string;
  currency: "EUR" | "USD" | "GBP";
  items: ShippingQuotedItem[];
};

export type ShippingQuoteResult = {
  totalShippingCents: number;
  currency: string;
  perItem: { variantId: string; shippingCents: number }[];
};

export const shippingClient = {
  countries: (variantIds: string[]) =>
    clientFetch<ShippingCountriesResult>("/shipping/countries", {
      method: "POST",
      body: { variantIds },
    }),

  quote: (body: ShippingQuoteBody) =>
    clientFetch<ShippingQuoteResult>("/shipping/quote", {
      method: "POST",
      body,
    }),
};
