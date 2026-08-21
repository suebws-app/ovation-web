import { z } from "zod";

type T = (
  key: string,
  params?: Record<string, string | number | Date>,
) => string;

const SLUG_RE = /^[a-z0-9-]+$/;

export const getWeddingSchema = (t: T) =>
  z
    .object({
      partnerAName: z
        .string()
        .min(1, t("validation__partner_name_required"))
        .max(50, t("validation__partner_name_max")),
      // Optional: single-host types (birthday, memorial, …) don't render a second
      // host field, so requiring it would silently block the whole form's submit.
      partnerBName: z.string().max(50, t("validation__partner_name_max")),
      eventName: z.string().max(80).optional(),
      weddingDate: z.string().max(20).optional(),
      endDate: z.string().max(20).optional(),
      multiDay: z.boolean().optional(),
      venueName: z.string().max(100).optional(),
      venueCity: z.string().max(100).optional(),
      expectedGuests: z.string().max(6).optional(),
      welcomeMessage: z.string().max(200).optional(),
      themeColor: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .optional(),
      slug: z
        .string()
        .max(20)
        .refine(
          (v) => v === "" || (v.length >= 4 && SLUG_RE.test(v)),
          t("validation__slug_format"),
        ),
    })
    .refine((v) => !v.weddingDate || !v.endDate || v.endDate >= v.weddingDate, {
      path: ["endDate"],
      message: t("settings__wedding__end_before_start"),
    });

export type WeddingFields = {
  partnerAName: string;
  partnerBName: string;
  eventName?: string;
  weddingDate?: string;
  endDate?: string;
  multiDay?: boolean;
  venueName?: string;
  venueCity?: string;
  expectedGuests?: string;
  welcomeMessage?: string;
  themeColor?: string;
  slug: string;
};
