"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { FAQItem } from "./FAQItem";

export const FAQSection = () => {
  const t = useTranslations();
  const [openIndex, setOpenIndex] = useState(0);

  const items = [
    { q: t("marketing__faq__q1"), a: t("marketing__faq__a1") },
    { q: t("marketing__faq__q2"), a: t("marketing__faq__a2") },
    { q: t("marketing__faq__q3"), a: t("marketing__faq__a3") },
    { q: t("marketing__faq__q4"), a: t("marketing__faq__a4") },
    { q: t("marketing__faq__q5"), a: t("marketing__faq__a5") },
    { q: t("marketing__faq__q6"), a: t("marketing__faq__a6") },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-30">
      <div className="mx-auto max-w-310 px-6 lg:px-20">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="text-primary type-overline font-bold tracking-[2.2px] uppercase">
              {t("marketing__faq__eyebrow")}
            </p>
            <h2 className="type-display mt-4 font-serif leading-tight font-semibold">
              <span className="block">{t("marketing__faq__title_line1")}</span>
              <span className="text-primary block italic">
                {t("marketing__faq__title_line2")}
              </span>
            </h2>
            <p className="text-muted-foreground type-body-large mt-6 max-w-90 leading-relaxed">
              {t("marketing__faq__subtitle")}
            </p>
            <a
              href={`mailto:${t("marketing__faq__email")}`}
              className="text-foreground mt-5 inline-flex items-center gap-2 text-sm font-semibold"
            >
              {t("marketing__faq__email")}
              <ArrowRight className="size-3" />
            </a>
          </div>

          <div>
            {items.map((item, index) => (
              <FAQItem
                key={index}
                question={item.q}
                answer={item.a}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
