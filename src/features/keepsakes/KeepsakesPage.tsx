"use client";

import { Eyebrow } from "@ovation/ui/components/Eyebrow";

import { FeaturedProduct } from "./components/FeaturedProduct";
import { ProductCard } from "./components/ProductCard";
import { OrdersRail } from "./components/OrdersRail";
import { BundleBanner } from "./components/BundleBanner";
import { TestimonialStrip } from "./components/TestimonialStrip";
import { FilterTabs } from "./components/FilterTabs";

const PRODUCTS = [
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
      "A living album guests can revisit. Share a single link — plays on any device.",
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

export const KeepsakesPage = () => {
  return (
    <div className="min-w-0">
      <div>
        <Eyebrow className="tracking-[2px] text-[#9A6B2F]">
          The keepsake studio
        </Eyebrow>
        <h1 className="mt-2.5 max-w-225 font-serif text-[2rem] font-semibold leading-none tracking-tight tablet:text-[3.375rem]">
          Turn 87 voices into
          <br />
          <span className="italic" style={{ color: "#C88C36" }}>
            something you can hold.
          </span>
        </h1>
        <p className="mt-3.5 max-w-155 type-body-small leading-relaxed text-muted-foreground">
          Pick what speaks to you — we print, press, and ship. Every keepsake is
          built from the 87 messages and 64 photos your guests have already
          given you.
        </p>
      </div>

      <div className="grid gap-5 desktop:grid-cols-[1fr_320px]">
        <FeaturedProduct price={389} />
        <OrdersRail />
      </div>

      <div className="mt-5">
        <BundleBanner />
      </div>

      <div className="mt-9 flex flex-col gap-4.5 tablet:flex-row tablet:items-end tablet:justify-between">
        <div>
          <Eyebrow className="text-muted-foreground">
            More ways to keep it
          </Eyebrow>
          <h2 className="mt-1.5 font-serif text-[1.75rem] font-semibold tracking-tight">
            The rest of the collection
          </h2>
        </div>
        <FilterTabs />
      </div>

      <div className="mt-4.5 grid gap-4.5 tablet:grid-cols-2 desktop:grid-cols-3">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>

      <div className="mt-8">
        <TestimonialStrip />
      </div>

      <p className="mt-6 text-center type-caption text-muted-foreground">
        Every keepsake is carbon-neutral &middot; printed in Portugal &middot;
        shipped worldwide
      </p>
    </div>
  );
};
