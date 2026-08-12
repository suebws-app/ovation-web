import { getTranslations } from "next-intl/server";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { SectionTitle } from "../../../components/SectionTitle";
import { PricingTeaserBody } from "./PricingTeaserBody";

type PricingTeaserProps = {
  couplePrice: string;
  proPrice: string;
};

export const PricingTeaser = async ({
  couplePrice,
  proPrice,
}: PricingTeaserProps) => {
  const t = await getTranslations();

  return (
    <section className="bg-card border-border border-t">
      <div className="section-container flex flex-col items-center text-center">
        <Kicker className="text-primary mb-4">
          {t("marketing__pricing_teaser__eyebrow")}
        </Kicker>
        <SectionTitle className="mx-auto max-w-160 leading-tight">
          {t("marketing__pricing_teaser__title_line1")}{" "}
          <span className="text-primary italic">
            {t("marketing__pricing_teaser__title_line2")}
          </span>
        </SectionTitle>
        <PricingTeaserBody
          coupleFallbackPrice={couplePrice}
          proFallbackPrice={proPrice}
        />
        <Button size="lg" className="mt-8" asChild>
          <Link href={appRoutes.marketing.pricing}>
            {t("marketing__pricing_teaser__cta")}
          </Link>
        </Button>
      </div>
    </section>
  );
};
