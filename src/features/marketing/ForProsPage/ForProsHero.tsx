import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { SectionTitle } from "@/components/SectionTitle";
import { PRICING_ANCHOR } from "./constants";

export const ForProsHero = () => {
  const t = useTranslations();

  return (
    <section>
      <div className="section-container-small flex flex-col items-center text-center">
        <Kicker className="text-primary">
          {t("marketing__for_pros__eyebrow")}
        </Kicker>
        <SectionTitle as="h1" className="mt-4 leading-none tracking-tighter">
          <span className="text-foreground block">
            {t("marketing__for_pros__title_line1")}
          </span>
          <span className="text-primary block italic">
            {t("marketing__for_pros__title_line2")}
          </span>
        </SectionTitle>
        <p className="text-muted-foreground type-body-large mt-6 max-w-160 leading-relaxed">
          {t("marketing__for_pros__description")}
        </p>
        <Button variant="pillPrimary" size="pill" asChild className="mt-8">
          <a href={`#${PRICING_ANCHOR}`}>
            {t("marketing__for_pros__cta_pricing")}
          </a>
        </Button>
      </div>
    </section>
  );
};
