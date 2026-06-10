import { clientFetch } from "./client";

export type PeechoOfferingAttributes = {
  pageWidthMm?: number;
  pageHeightMm?: number;
  minPages?: number;
  maxPages?: number;
  paperStock?: string;
  [key: string]: unknown;
};

export type PeechoOfferingDto = {
  id: string;
  name: string;
  attributes: PeechoOfferingAttributes;
  isActive: boolean;
  lastSeenAt: string;
};

export type LinkVariantMapping = {
  peechoOfferingId: string;
  name: string;
  sku: string;
  priceCents: number;
  attributes: PeechoOfferingAttributes;
};

export type LinkProductBody = {
  name: string;
  slug: string;
  productType: "hardcover" | "softcover" | "layflat" | string;
  category: string;
  basePriceCents: number;
  heroImageUrl?: string;
  leadTimeMinDays?: number;
  leadTimeMaxDays?: number;
  variantMappings?: LinkVariantMapping[];
};

export type SyncCatalogResult = {
  syncedAt: string;
  offeringsCount: number;
};

export type ListOfferingsResult = {
  offerings: PeechoOfferingDto[];
};

export type LinkOfferingResult = {
  productId: string;
  peechoOfferingId: string;
  slug: string;
};

export type PrintApprovalActionResult = {
  orderId: string;
  printApprovalStatus: string;
  fulfillmentStatus: string;
};

export const peechoAdminClient = {
  syncCatalog: () =>
    clientFetch<SyncCatalogResult>("/peecho/sync", { method: "POST" }),

  listOfferings: (activeOnly?: boolean) =>
    clientFetch<ListOfferingsResult>("/peecho/offerings", {
      query: activeOnly !== undefined ? { active: activeOnly } : undefined,
    }),

  linkOfferingToProduct: (offeringId: string, body: LinkProductBody) =>
    clientFetch<LinkOfferingResult>(
      `/peecho/offerings/${offeringId}/link-product`,
      { method: "POST", body },
    ),

  approveOrder: (orderId: string) =>
    clientFetch<PrintApprovalActionResult>(
      `/peecho/orders/${orderId}/approve`,
      { method: "POST" },
    ),

  rejectOrder: (orderId: string, reason?: string) =>
    clientFetch<PrintApprovalActionResult>(`/peecho/orders/${orderId}/reject`, {
      method: "POST",
      body: reason ? { reason } : {},
    }),
};
