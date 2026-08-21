import { useTranslations } from "next-intl";
import { Accordion } from "@ovation/ui/components/Accordion";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { FAQ_ITEM_KEYS } from "../../../constants";
import { GENERAL_KEY_PREFIX } from "../../../variant";
import { FAQ_DRE_FALLBACK_PRICE } from "./constants";
import { FaqItem } from "./FaqItem";

type FaqSectionProps = {
  drePrice?: string;
};

export const FaqSection = ({
  drePrice = FAQ_DRE_FALLBACK_PRICE,
}: FaqSectionProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL_KEY_PREFIX}${suffix}`);

  return (
    <section className="bg-background">
      <div className="tablet:py-20 desktop:py-24 mx-auto w-full max-w-332 px-6 py-14">
        <div className="tablet:grid-cols-[1fr_1.4fr] tablet:gap-20 grid grid-cols-1 gap-10">
          <div className="flex flex-col items-start">
            <h2 className="landing-h1 tablet:landing-display text-foreground">
              {k("faq_title")}
            </h2>
            <p className="landing-body-large text-muted-foreground mt-5 max-w-100">
              {k("faq_description")}
            </p>
            <Button variant="pillPrimary" size="pill" asChild className="mt-8">
              <Link href={appRoutes.marketing.contact}>{k("faq_cta")}</Link>
            </Button>
          </div>

          <Accordion type="single" collapsible>
            {FAQ_ITEM_KEYS.map((item, index) => (
              <FaqItem
                key={item.q}
                value={`faq-${index}`}
                question={t(item.q)}
                answerKey={item.a}
                fallbackPrice={drePrice}
              />
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
