import type { InvitationTemplate } from "@/lib/api/types";

export type InvitationTemplateMeta = InvitationTemplate;

export const DEFAULT_INVITATION_TEMPLATE_ID = "classic_elegance";

export const FRONTEND_FONT_STACKS: Record<string, string> = {
  cormorant:
    "var(--font-cormorant), 'Cormorant Garamond', 'Times New Roman', Times, serif",
  playfair:
    "var(--font-playfair), 'Playfair Display', 'Times New Roman', Times, serif",
  lora: "var(--font-lora), 'Lora', 'Times New Roman', Times, serif",
  cinzel: "var(--font-cinzel), 'Cinzel', 'Times New Roman', Times, serif",
  dancing: "var(--font-dancing-script), 'Dancing Script', cursive",
  pacifico: "var(--font-pacifico), 'Pacifico', cursive",
  inter: "'Inter', system-ui, sans-serif",
  lato: "'Lato', system-ui, sans-serif",
  quicksand: "var(--font-quicksand), 'Quicksand', system-ui, sans-serif",
  helvetica: "Helvetica, Arial, sans-serif",
};

export const resolveFontStack = (fontKey: string): string =>
  FRONTEND_FONT_STACKS[fontKey] ?? FRONTEND_FONT_STACKS.inter;
