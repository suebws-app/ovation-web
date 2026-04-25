export type KeepsakeProduct = {
  id: string;
  name: string;
  price: number;
  subtitle: string;
  eta: string;
  tagline: string;
  gradient: string;
  headline: string;
  dark?: boolean;
};

export const KEEPSAKE_PRODUCTS: KeepsakeProduct[] = [
  {
    id: "video",
    name: "Highlight Reel",
    price: 89,
    subtitle: "Digital",
    eta: "5 days",
    tagline:
      "A 3-minute film stitched from every voice and photo your guests left.",
    gradient: "linear-gradient(135deg, #9CB8EE, #5E86DC)",
    headline: "Their words. Their faces. One reel.",
  },
  {
    id: "vinyl",
    name: "Audio Vinyl",
    price: 129,
    subtitle: "Pressed vinyl",
    eta: "4 weeks",
    tagline:
      "Side A: speeches. Side B: chaos. A real 12\u2033 record from your guest audio.",
    gradient: "linear-gradient(135deg, #4a4a4a, #1a1a1a)",
    headline: "Side A: speeches. Side B: chaos.",
    dark: true,
  },
  {
    id: "album",
    name: "Digital Album",
    price: 29,
    subtitle: "Shareable link",
    eta: "Instant",
    tagline:
      "A living album guests can revisit. Share a single link \u2014 plays on any device.",
    gradient: "linear-gradient(135deg, #BCEEC9, #5EC678)",
    headline: "A living album, link-shareable.",
  },
  {
    id: "cards",
    name: "Thank-You Cards",
    price: 49,
    subtitle: "Set of 50",
    eta: "7 days",
    tagline:
      "Each card features the guest\u2019s own photo and a snippet of what they said.",
    gradient: "linear-gradient(135deg, #F4B59C, #E27A58)",
    headline: "Say thanks \u2014 in their own photo.",
  },
  {
    id: "canvas",
    name: "Voice Canvas",
    price: 69,
    subtitle: "Framed print",
    eta: "10 days",
    tagline: "One favourite quote, typeset on archival canvas. Ready to hang.",
    gradient: "linear-gradient(135deg, #F1D3D7, #D39BA3)",
    headline: "One favourite, on the wall.",
  },
];
