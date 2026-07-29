import { z } from "zod";

type Translate = (key: string) => string;

export const getVendorSchema = (t: Translate) =>
  z.object({
    name: z.string().trim().min(1, t("wp__vendors__err_name")).max(120),
    category: z.string().trim().max(120),
    contact: z.string().trim().max(120),
    phone: z.string().trim().max(120),
    status: z.enum(["Booked", "In talks", "Shortlist"]),
    rating: z.number().int().min(0).max(5),
    price: z.string().trim().max(12),
    deposit: z.string().trim().max(12),
  });

export type VendorFields = z.infer<ReturnType<typeof getVendorSchema>>;
