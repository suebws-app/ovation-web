import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";

import type { KeepsakeProductDetail } from "@/lib/api/types";
import type { KeepsakeDesign } from "../designTokens";

type CustomizerHeaderProps = {
  product: KeepsakeProductDetail;
  design: KeepsakeDesign;
};

export const CustomizerHeader = ({
  product,
  design,
}: CustomizerHeaderProps) => {
  const t = useTranslations();
  const dark = Boolean(design.dark);
  const displayName = product.name ? t(product.name) : "";
  const displayDescription = product.description ? t(product.description) : "";
  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-20 relative flex h-40 items-center justify-center px-6"
        style={{ background: design.gradient }}
      >
        <p
          className="type-h1 text-center leading-tight font-semibold italic"
          style={{
            color: dark ? "#fff" : "var(--foreground)",
            textShadow: dark ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
          }}
        >
          {displayName}
        </p>
      </div>
      <div className="flex items-baseline justify-between">
        <div>
          <Kicker className="text-muted-foreground">{product.category}</Kicker>
          <h1 className="type-h2 mt-1 font-semibold">{displayName}</h1>
          {displayDescription && (
            <p className="type-body-small text-muted-foreground mt-2 max-w-180 leading-relaxed">
              {displayDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
