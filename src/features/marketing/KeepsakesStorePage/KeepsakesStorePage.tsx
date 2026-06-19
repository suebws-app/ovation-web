import { getTranslations } from "next-intl/server";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@ovation/ui/components/Kicker";
import { KeepsakeCard } from "./KeepsakeCard";
import { keepsakesApi } from "@/lib/api/keepsakes";
import { formatPrice } from "@/features/checkout/orderHelpers";
import { CurrencySelect } from "@/components/CurrencySelect";

export const KeepsakesStorePage = async () => {
  const t = await getTranslations();
  const catalog = await keepsakesApi.catalog().catch(() => ({ products: [] }));

  const comingSoonLabel = t("marketing__keepsakes__coming_soon");
  const fromLabel = t("marketing__keepsakes__price_from");

  const products = catalog.products.map((product) => ({
    name: t(product.name),
    description: t(product.description),
    price: product.comingSoon
      ? ""
      : `${fromLabel} ${formatPrice(product.priceCents, product.currency)}`,
    comingSoon: product.comingSoon,
  }));

  return (
    <>
      <section>
        <div className="section-container-small">
          <div className="flex items-start justify-between gap-4">
            <Kicker className="text-primary">
              {t("marketing__keepsakes__eyebrow")}
            </Kicker>
            <CurrencySelect />
          </div>
          <SectionTitle as="h1" className="mt-4 leading-none tracking-tighter">
            <span className="text-foreground block">
              {t("marketing__keepsakes__title_line1")}
            </span>
            <span className="text-primary block italic">
              {t("marketing__keepsakes__title_line2")}
            </span>
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__keepsakes__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-6">
            {products.map((product) => (
              <KeepsakeCard
                key={product.name}
                name={product.name}
                description={product.description}
                price={product.price}
                comingSoon={product.comingSoon}
                comingSoonLabel={comingSoonLabel}
              />
            ))}
          </div>
          <p className="text-muted-foreground type-body-small mt-10">
            {t("marketing__keepsakes__shipping_note")}
          </p>
        </div>
      </section>
    </>
  );
};
