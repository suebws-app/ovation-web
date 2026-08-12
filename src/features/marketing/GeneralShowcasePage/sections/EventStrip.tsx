import { useTranslations } from "next-intl";
import { GENERAL2_PREFIX, OCCASIONS } from "../constants";
import { MarqueeWord } from "./MarqueeWord";

export const EventStrip = () => {
  const t = useTranslations();
  const words = OCCASIONS.map((occasion) =>
    t(`${GENERAL2_PREFIX}${occasion.titleSuffix}`),
  );
  const loop = [...words, ...words];

  return (
    <section
      aria-hidden
      className="ov-marquee-mask bg-warm-panel/40 border-border section-container overflow-hidden border-y py-5 opacity-30"
    >
      <div className="ov-marquee-track flex items-center gap-8">
        {loop.map((word, index) => (
          <MarqueeWord key={`${word}-${index}`} label={word} />
        ))}
      </div>
    </section>
  );
};
