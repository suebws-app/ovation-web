import type { InvitationTemplate } from "@/lib/api/types";

export type InvitationTemplateMeta = InvitationTemplate;

export const DEFAULT_INVITATION_TEMPLATE_ID = "floral_blush";

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
  sacramento:
    "var(--font-sacramento), 'Sacramento', 'Brush Script MT', cursive",
  montserrat: "var(--font-montserrat), 'Montserrat', system-ui, sans-serif",
  bebas: "var(--font-bebas), 'Bebas Neue', 'Arial Narrow', sans-serif",
  abhaya:
    "var(--font-abhaya), 'Abhaya Libre', Georgia, 'Times New Roman', serif",
  sevillana: "var(--font-sevillana), 'Sevillana', 'Brush Script MT', cursive",
  great_vibes:
    "var(--font-great-vibes), 'Great Vibes', 'Brush Script MT', cursive",
  merienda: "var(--font-merienda), 'Merienda', cursive",
  libre_baskerville:
    "var(--font-libre-baskerville), 'Libre Baskerville', Georgia, serif",
  italiana: "var(--font-italiana), 'Italiana', 'Times New Roman', serif",
  poppins: "var(--font-poppins), 'Poppins', system-ui, sans-serif",
  montez: "var(--font-montez), 'Montez', 'Brush Script MT', cursive",
};

export const resolveFontStack = (fontKey: string): string =>
  FRONTEND_FONT_STACKS[fontKey] ?? FRONTEND_FONT_STACKS.inter;
