import { notFound } from "next/navigation";
import {
  Cinzel,
  Cormorant_Garamond,
  Dancing_Script,
  Great_Vibes,
  Italiana,
  Libre_Baskerville,
  Lora,
  Merienda,
  Montez,
  Montserrat,
  Pacifico,
  Playfair_Display,
  Poppins,
  Quicksand,
  Sacramento,
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
const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sacramento",
  display: "swap",
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});
const merienda = Merienda({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merienda",
  display: "swap",
});
const montez = Montez({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-montez",
  display: "swap",
});
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
  display: "swap",
});
const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-montserrat",
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
  sacramento.variable,
  montserrat.variable,
  greatVibes.variable,
  merienda.variable,
  montez.variable,
  libreBaskerville.variable,
  italiana.variable,
  poppins.variable,
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
