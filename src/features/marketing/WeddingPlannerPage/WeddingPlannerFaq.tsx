import { getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ovation/ui/components/Accordion";
import { Kicker } from "@ovation/ui/components/Kicker";
import { SectionTitle } from "../../../components/SectionTitle";
import { JsonLd } from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/seo/schemas";
import { WEDDING_PLANNER_FAQ_KEYS } from "./constants";

export const WeddingPlannerFaq = async () => {
  const t = await getTranslations();

  const items = WEDDING_PLANNER_FAQ_KEYS.map((k) => ({
    q: t(k.q),
    a: t(k.a),
  }));

  return (
    <section>
      <JsonLd data={faqPageSchema(items)} />
      <div className="section-container-small">
        <Kicker className="text-primary">
          {t("marketing__wedding_planner__faq_eyebrow")}
        </Kicker>
        <SectionTitle className="mt-4">
          {t("marketing__wedding_planner__faq_title")}
        </SectionTitle>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="mt-8"
        >
          {items.map((item, index) => (
            <AccordionItem key={item.q} value={`item-${index}`}>
              <AccordionTrigger className="type-h3 py-5.5 text-left font-semibold no-underline hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground type-body max-w-160 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
