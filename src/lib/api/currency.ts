import { apiFetch } from "./server";

export type SupportedCurrenciesResponse = {
  default: string;
  currencies: string[];
};

export const currencyApi = {
  list: () => apiFetch<SupportedCurrenciesResponse>("/currencies"),
};
