import {
  Cinzel,
  Cormorant_Garamond,
  Dancing_Script,
  Lora,
  Pacifico,
  Playfair_Display,
  Quicksand,
} from "next/font/google";
import { getCurrentEvent } from "@/lib/auth/current-event";
import { inviteesApi } from "@/lib/api/invitees";
import type { Invitee } from "@/lib/api/types";
import { InvitationPage } from "./InvitationPage";

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

export const InvitationPageServer = async () => {
  const event = await getCurrentEvent();

  let initialInvitees: Invitee[] = [];
  if (event?.id) {
    const result = await inviteesApi.list(event.id).catch(() => null);
    initialInvitees = result?.invitees ?? [];
  }

  return (
    <div className={`${invitationFontClasses} contents`}>
      <InvitationPage
        eventId={event?.id ?? null}
        initialEvent={event ?? null}
        initialInvitees={initialInvitees}
      />
    </div>
  );
};
