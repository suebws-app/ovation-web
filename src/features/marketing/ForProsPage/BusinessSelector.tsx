"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SectionTitle } from "@/components/SectionTitle";
import { BusinessOption } from "./BusinessOption";
import { BusinessPanel } from "./BusinessPanel";
import { PRO_BUSINESSES, businessLabelKey } from "./constants";

const PANEL_ID = "pro-business-panel";

export const BusinessSelector = () => {
  const t = useTranslations();
  const [selected, setSelected] = useState(PRO_BUSINESSES[0].key);
  const selectedBusiness =
    PRO_BUSINESSES.find((business) => business.key === selected) ??
    PRO_BUSINESSES[0];

  return (
    <section>
      <div className="section-container-small">
        <SectionTitle as="h2">
          {t("marketing__for_pros__business_title")}
        </SectionTitle>
        <p className="text-muted-foreground type-body-large mt-3 leading-relaxed">
          {t("marketing__for_pros__business_subtitle")}
        </p>

        <div className="desktop:grid-cols-[minmax(0,22rem)_1fr] mt-10 grid grid-cols-1 items-start gap-6">
          <div role="tablist" className="flex flex-col gap-3">
            {PRO_BUSINESSES.map(({ key, Icon }) => (
              <BusinessOption
                key={key}
                businessKey={key}
                label={t(businessLabelKey(key))}
                Icon={Icon}
                isSelected={key === selected}
                panelId={PANEL_ID}
                onSelect={setSelected}
              />
            ))}
          </div>

          <BusinessPanel
            businessKey={selectedBusiness.key}
            Icon={selectedBusiness.Icon}
            panelId={PANEL_ID}
          />
        </div>
      </div>
    </section>
  );
};
