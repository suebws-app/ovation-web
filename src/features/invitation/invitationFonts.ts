import {
  Abhaya_Libre,
  Bebas_Neue,
  Cinzel,
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
  Sevillana,
} from "next/font/google";

const abhaya = Abhaya_Libre({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-abhaya",
  display: "swap",
});
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
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
const sevillana = Sevillana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sevillana",
  display: "swap",
});

export const invitationFontVariables = [
  abhaya.variable,
  bebas.variable,
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
  sevillana.variable,
].join(" ");
