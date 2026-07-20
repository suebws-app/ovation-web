import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";

import type { KeepsakeProductDetail } from "@/lib/api/types";

type CustomizerHeaderProps = {
  product: KeepsakeProductDetail;
};

export const CustomizerHeader = ({ product }: CustomizerHeaderProps) => {
  const t = useTranslations();
  const displayName = product.name ? t(product.name) : "";
  const displayDescription = product.description ? t(product.description) : "";
  return (
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
  );
};
