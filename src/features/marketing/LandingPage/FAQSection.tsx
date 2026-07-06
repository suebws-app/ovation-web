import { getTranslations } from "next-intl/server";
import { SectionTitle } from "../../../components/SectionTitle";
import { FAQ_ITEM_KEYS } from "./constants";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ovation/ui/components/Accordion";
import { Kicker } from "@ovation/ui/components/Kicker";
import { clientEnv } from "@/lib/utils/env.client";
import { plansApi } from "@/lib/api/plans";

const DRE_FALLBACK_PRICE = "€20";

const fetchDrePrice = async (): Promise<string> => {
  try {
    const plan = await plansApi.findByCode("storage_extension");
    return plan.productVariables.regularPriceFormatted ?? DRE_FALLBACK_PRICE;
  } catch {
    return DRE_FALLBACK_PRICE;
  }
};

export const FAQSection = async () => {
  const t = await getTranslations();
  const supportEmail = clientEnv.SUPPORT_EMAIL;
  const drePrice = await fetchDrePrice();

  const items = FAQ_ITEM_KEYS.map((k) => ({
    q: t(k.q),
    a: t(k.a, { drePrice }),
  }));

  return (
    <section>
      <div className="section-container">
        <div className="tablet:gap-20 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <Kicker className="text-primary">
              {t("marketing__faq__eyebrow")}
            </Kicker>
            <SectionTitle className="mt-4">
              <span className="block">{t("marketing__faq__title_line1")}</span>
              <span className="text-primary block italic">
                {t("marketing__faq__title_line2")}
              </span>
            </SectionTitle>
            <p className="text-muted-foreground type-body-large mt-6 max-w-90 leading-relaxed">
              {t("marketing__faq__subtitle")}
            </p>
            <a
              href={`mailto:${supportEmail}`}
              className="text-foreground type-body-small mt-5 inline-flex items-center gap-2 font-semibold"
            >
              {t("marketing__faq__email", { email: supportEmail })}
            </a>
          </div>

          <Accordion type="single" collapsible defaultValue="item-0">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="type-h3 py-5.5 font-semibold no-underline hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground type-body max-w-160 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
