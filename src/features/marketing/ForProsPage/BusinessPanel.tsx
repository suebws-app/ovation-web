"use client";

import { type ComponentType, type SVGProps } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { PRICING_ANCHOR, businessBodyKey, businessTitleKey } from "./constants";

type BusinessPanelProps = {
  businessKey: string;
  panelId: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const BusinessPanel = ({
  businessKey,
  panelId,
  Icon,
}: BusinessPanelProps) => {
  const t = useTranslations();

  return (
    <div
      id={panelId}
      role="tabpanel"
      className="rounded-16 border-border bg-warm-panel/30 flex h-full flex-col border p-8"
    >
      <span className="bg-primary text-primary-foreground rounded-12 flex size-12 items-center justify-center">
        <Icon className="size-6" aria-hidden />
      </span>

      <h3 className="landing-h2 text-foreground mt-6">
        {t(businessTitleKey(businessKey))}
      </h3>
      <p className="text-muted-foreground type-body mt-4 leading-relaxed">
        {t(businessBodyKey(businessKey))}
      </p>

      <Button
        variant="pillPrimary"
        size="pill"
        asChild
        className="mt-8 self-start"
      >
        <a href={`#${PRICING_ANCHOR}`}>
          {t("marketing__for_pros__cta_pricing")}
        </a>
      </Button>
    </div>
  );
};
