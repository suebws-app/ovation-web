import Image from "next/image";

type Cell = {
  key: string;
  alt: string;
  src: string;
  className: string;
  sizes: string;
  priority?: boolean;
};

const CELLS: Cell[] = [
  {
    key: "hug",
    alt: "Couple embracing on their wedding day",
    src: "/images/hero_hug.webp",
    className: "tablet:col-span-4 tablet:row-span-3 col-span-2 row-span-2",
    sizes: "(min-width: 740px) 40vw, 100vw",
    priority: true,
  },
  {
    key: "cheers",
    alt: "Guests raising a toast",
    src: "/images/hero_cheers.webp",
    className: "tablet:col-span-2 tablet:row-span-2 col-span-1 row-span-1",
    sizes: "(min-width: 740px) 20vw, 50vw",
  },
  {
    key: "hands",
    alt: "Bride and groom holding hands",
    src: "/images/hero_hands.webp",
    className: "tablet:col-span-2 tablet:row-span-2 col-span-1 row-span-1",
    sizes: "(min-width: 740px) 20vw, 50vw",
  },
  {
    key: "girl",
    alt: "Guest smiling during the celebration",
    src: "/images/hero_girl.webp",
    className: "tablet:col-span-3 tablet:row-span-2 col-span-1 row-span-1",
    sizes: "(min-width: 740px) 30vw, 50vw",
  },
  {
    key: "man",
    alt: "Guest sharing a moment",
    src: "/images/hero_man.jpg.webp",
    className: "tablet:col-span-3 tablet:row-span-2 col-span-1 row-span-1",
    sizes: "(min-width: 740px) 30vw, 50vw",
  },
];

export const HeroMosaic = () => (
  <div className="tablet:grid-cols-6 tablet:grid-rows-[repeat(5,minmax(0,5rem))] grid grid-cols-2 grid-rows-[repeat(3,minmax(0,5rem))] gap-3.5">
    {CELLS.map((cell) => (
      <div
        key={cell.key}
        className={`rounded-16 bg-warm-panel/40 relative overflow-hidden shadow-lg ${cell.className}`}
      >
        <Image
          src={cell.src}
          alt={cell.alt}
          fill
          sizes={cell.sizes}
          priority={cell.priority}
          className="object-cover"
        />
      </div>
    ))}
  </div>
);
