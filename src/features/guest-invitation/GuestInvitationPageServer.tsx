import { notFound } from "next/navigation";
import {
  Cinzel,
  Cormorant_Garamond,
  Dancing_Script,
  Lora,
  Pacifico,
  Playfair_Display,
  Quicksand,
} from "next/font/google";
import { ApiError } from "@/lib/api/client";
import { invitationTemplatesApi } from "@/lib/api/invitation-templates";
import { publicApi } from "@/lib/api/public";
import { GuestInvitationView } from "./components/GuestInvitationView";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-playfair",
  display: "swap",
});
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-lora",
  display: "swap",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cinzel",
  display: "swap",
});
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
  display: "swap",
});
const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing-script",
  display: "swap",
});
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-quicksand",
  display: "swap",
});

const invitationFontClasses = [
  cormorant.variable,
  playfair.variable,
  lora.variable,
  cinzel.variable,
  pacifico.variable,
  dancing.variable,
  quicksand.variable,
].join(" ");

type GuestInvitationPageServerProps = {
  params: Promise<{ slug: string; token: string }>;
};

export const GuestInvitationPageServer = async ({
  params,
}: GuestInvitationPageServerProps) => {
  const { slug, token } = await params;

  const [invitation, templatesResponse] = await Promise.all([
    publicApi.getInvitation(slug, token).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    invitationTemplatesApi.list().catch(() => null),
  ]);

  if (!invitation) notFound();

  const templates = templatesResponse?.templates ?? [];
  const fallbackTemplateId = templatesResponse?.defaultTemplateId;
  const template =
    templates.find((tpl) => tpl.id === invitation.event.invitationTemplateId) ??
    templates.find((tpl) => tpl.id === fallbackTemplateId) ??
    templates[0];

  if (!template) notFound();

  return (
    <div className={`${invitationFontClasses} contents`}>
      <GuestInvitationView
        slug={slug}
        token={token}
        event={invitation.event}
        invitee={invitation.invitee}
        template={template}
      />
    </div>
  );
};
