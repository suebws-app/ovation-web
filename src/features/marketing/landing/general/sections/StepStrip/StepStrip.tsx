import { useTranslations } from "next-intl";
import { GENERAL_KEY_PREFIX } from "../../../variant";
import { STEP_STRIP_ITEMS } from "./constants";
import { StepStripItem } from "./StepStripItem";

export const StepStrip = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL_KEY_PREFIX}${suffix}`);

  return (
    <section className="from-background to-warm-cream bg-gradient-to-b">
      <div className="tablet:pb-14 mx-auto w-full max-w-332 px-6 pb-10">
        <div className="border-border rounded-16 bg-background/60 tablet:mx-auto tablet:w-fit tablet:flex-row tablet:items-center tablet:justify-center tablet:gap-6 tablet:px-7 flex flex-col gap-5 border px-6 py-5">
          {STEP_STRIP_ITEMS.map((item, index) => (
            <StepStripItem
              key={item.number}
              Icon={item.Icon}
              label={t(`${GENERAL_KEY_PREFIX}hero_step_label`, {
                number: item.number,
              })}
              text={k(item.textSuffix)}
              showConnector={index < STEP_STRIP_ITEMS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
