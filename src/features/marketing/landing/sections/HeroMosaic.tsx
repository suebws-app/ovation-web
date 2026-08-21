import Image from "next/image";
import { useTranslations } from "next-intl";

type Cell = {
  key: string;
  altKey: string;
  src: string;
  className: string;
  sizes: string;
  priority?: boolean;
  quality: number;
};

const LCP_WIDTHS = [384, 640, 750] as const;

const CELLS: Cell[] = [
  {
    key: "hug",
    altKey: "marketing__hero_mosaic__alt_hug",
    src: "/images/hero_hug.webp",
    className: "tablet:col-span-4 tablet:row-span-3 col-span-2 row-span-2",
    sizes: "(min-width: 740px) 40vw, 100vw",
    priority: true,
    quality: 65,
  },
  {
    key: "cheers",
    altKey: "marketing__hero_mosaic__alt_cheers",
    src: "/images/hero_cheers.webp",
    className: "tablet:col-span-2 tablet:row-span-2 col-span-1 row-span-1",
    sizes: "(min-width: 740px) 20vw, 50vw",
    quality: 65,
  },
  {
    key: "hands",
    altKey: "marketing__hero_mosaic__alt_hands",
    src: "/images/hero_hands.webp",
    className: "tablet:col-span-2 tablet:row-span-2 col-span-1 row-span-1",
    sizes: "(min-width: 740px) 20vw, 50vw",
    quality: 70,
  },
  {
    key: "girl",
    altKey: "marketing__hero_mosaic__alt_girl",
    src: "/images/hero_girl.webp",
    className: "tablet:col-span-3 tablet:row-span-2 col-span-1 row-span-1",
    sizes: "(min-width: 740px) 30vw, 50vw",
    quality: 70,
  },
  {
    key: "man",
    altKey: "marketing__hero_mosaic__alt_man",
    src: "/images/hero_man.jpg.webp",
    className: "tablet:col-span-3 tablet:row-span-2 col-span-1 row-span-1",
    sizes: "(min-width: 740px) 30vw, 50vw",
    quality: 70,
  },
];

const buildNextImageUrl = (src: string, width: number, quality: number) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;

const buildImageSrcSet = (src: string, quality: number) =>
  LCP_WIDTHS.map((w) => `${buildNextImageUrl(src, w, quality)} ${w}w`).join(
    ", ",
  );

export const HeroMosaic = () => {
  const t = useTranslations();
  const lcpCell = CELLS.find((cell) => cell.priority);

  return (
    <>
      {lcpCell && (
        <link
          rel="preload"
          as="image"
          href={buildNextImageUrl(lcpCell.src, 750, lcpCell.quality)}
          imageSrcSet={buildImageSrcSet(lcpCell.src, lcpCell.quality)}
          imageSizes={lcpCell.sizes}
          fetchPriority="high"
        />
      )}
      <div className="tablet:grid-cols-6 tablet:grid-rows-[repeat(5,minmax(0,5rem))] grid grid-cols-2 grid-rows-[repeat(3,minmax(0,5rem))] gap-3.5">
        {CELLS.map((cell) => (
          <div
            key={cell.key}
            className={`rounded-16 bg-warm-panel/40 relative overflow-hidden shadow-lg ${cell.className}`}
          >
            <Image
              src={cell.src}
              alt={t(cell.altKey)}
              fill
              sizes={cell.sizes}
              priority={cell.priority}
              quality={cell.quality}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
};
