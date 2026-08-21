import { useTranslations } from "next-intl";
import { StatItem } from "./StatItem";

const STAT_KEYS = [
  { value: "214", labelKey: "marketing__landing_b__stat_photos" },
  { value: "38", labelKey: "marketing__landing_b__stat_voice" },
  { value: "61", labelKey: "marketing__landing_b__stat_written" },
  { value: "68", labelKey: "marketing__landing_b__stat_guests" },
] as const;

export const StatBar = () => {
  const t = useTranslations();

  return (
    <section className="bg-warm-cream">
      <div className="section-container !py-0 pb-10">
        <div className="bg-card border-border tablet:grid-cols-2 desktop:grid-cols-4 rounded-20 grid grid-cols-1 overflow-hidden border">
          {STAT_KEYS.map((stat) => (
            <StatItem
              key={stat.labelKey}
              value={stat.value}
              label={t(stat.labelKey)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
