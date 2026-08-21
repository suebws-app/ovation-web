import { useTranslations } from "next-intl";
import { DashboardShowcase } from "./DashboardShowcase";
import { PhoneShowcase } from "./PhoneShowcase";
import { SectionHeader } from "./SectionHeader";
import { WEDDING_KEY_PREFIX } from "../variant";

type ProductShowcaseProps = {
  keyPrefix?: string;
};

export const ProductShowcase = ({
  keyPrefix = WEDDING_KEY_PREFIX,
}: ProductShowcaseProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${keyPrefix}${suffix}`);

  return (
    <section id="product" className="bg-warm-cream scroll-mt-20">
      <div className="section-container">
        <SectionHeader
          eyebrow={k("product_eyebrow")}
          title={k("product_title")}
          description={k("product_description")}
        />

        <div className="flex flex-col gap-20">
          <DashboardShowcase keyPrefix={keyPrefix} />
          <PhoneShowcase keyPrefix={keyPrefix} />
        </div>
      </div>
    </section>
  );
};
