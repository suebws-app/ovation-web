import { z } from "zod";

type T = (
  key: string,
  params?: Record<string, string | number | Date>,
) => string;

export const INVITATION_NAME_MAX = 24;
export const INVITATION_MESSAGE_MAX = 500;
export const INVITATION_SEATS_MIN = 1;
export const INVITATION_SEATS_MAX = 20;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getInvitationSchema = (t: T) =>
  z.object({
    templateId: z.string().min(1),
    partnerA: z
      .string()
      .trim()
      .min(1, t("validation__partner_name_required"))
      .max(INVITATION_NAME_MAX, t("validation__partner_name_max")),
    partnerB: z
      .string()
      .trim()
      .min(1, t("validation__partner_name_required"))
      .max(INVITATION_NAME_MAX, t("validation__partner_name_max")),
    weddingDate: z.string(),
    time: z.string(),
    venue: z.string(),
    place: z.string(),
    message: z.string().max(INVITATION_MESSAGE_MAX),
    guests: z.array(
      z.object({
        first: z.string(),
        email: z
          .string()
          .refine(
            (v) => v === "" || EMAIL_RE.test(v),
            t("validation__email_invalid"),
          ),
        phone: z.string(),
        seats: z
          .number()
          .int()
          .min(INVITATION_SEATS_MIN)
          .max(INVITATION_SEATS_MAX),
      }),
    ),
  });

export type InvitationFields = z.infer<ReturnType<typeof getInvitationSchema>>;
