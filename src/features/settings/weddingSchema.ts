import { z } from "zod";

type T = (
  key: string,
  params?: Record<string, string | number | Date>,
) => string;

const SLUG_RE = /^[a-z0-9-]+$/;

export const getWeddingSchema = (t: T) =>
  z
    .object({
      mode: z.enum(["couple", "event"]),
      eventName: z.string().max(80, t("validation__event_name_max")).optional(),
      partnerAName: z.string().max(50, t("validation__partner_name_max")),
      partnerBName: z.string().max(50, t("validation__partner_name_max")),
      weddingDate: z.string().max(20).optional(),
      venueName: z.string().max(100).optional(),
      venueCity: z.string().max(100).optional(),
      welcomeMessage: z.string().max(200).optional(),
      slug: z
        .string()
        .max(20)
        .refine(
          (v) => v === "" || (v.length >= 4 && SLUG_RE.test(v)),
          t("validation__slug_format"),
        ),
    })
    .superRefine((data, ctx) => {
      if (data.mode === "event") {
        if (!data.eventName?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["eventName"],
            message: t("validation__event_name_required"),
          });
        }
        return;
      }
      if (!data.partnerAName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["partnerAName"],
          message: t("validation__partner_name_required"),
        });
      }
      if (!data.partnerBName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["partnerBName"],
          message: t("validation__partner_name_required"),
        });
      }
    });

export type WeddingNameMode = "couple" | "event";

export type WeddingFields = {
  mode: WeddingNameMode;
  eventName?: string;
  partnerAName: string;
  partnerBName: string;
  weddingDate?: string;
  venueName?: string;
  venueCity?: string;
  welcomeMessage?: string;
  slug: string;
};
