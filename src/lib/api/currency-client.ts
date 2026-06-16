import { clientFetch } from "./client";
import type { SupportedCurrenciesResponse } from "./currency";

export const currencyClient = {
  list: () => clientFetch<SupportedCurrenciesResponse>("/currencies"),
};
