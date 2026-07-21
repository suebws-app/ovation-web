import { useTranslations } from "next-intl";
import { DashboardShowcase } from "./DashboardShowcase";
import { PhoneShowcase } from "./PhoneShowcase";
import { SectionHeader } from "./SectionHeader";

export const ProductShowcase = () => {
  const t = useTranslations();

  return (
    <section id="product" className="bg-warm-cream scroll-mt-20">
      <div className="section-container">
        <SectionHeader
          eyebrow={t("marketing__landing_b__product_eyebrow")}
          title={t("marketing__landing_b__product_title")}
          description={t("marketing__landing_b__product_description")}
        />

        <div className="flex flex-col gap-20">
          <DashboardShowcase />
          <PhoneShowcase />
        </div>
      </div>
    </section>
  );
};
