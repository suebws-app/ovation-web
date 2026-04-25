import { Eyebrow } from "@ovation/ui/components/Eyebrow";

import { KEEPSAKE_PRODUCTS } from "../mocks";
import { FilterTabs } from "./FilterTabs";
import { ProductCard } from "./ProductCard";

export const KeepsakesCollection = () => (
  <div className="mt-9">
    <div className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col gap-4.5">
      <div>
        <Eyebrow className="text-muted-foreground">
          More ways to keep it
        </Eyebrow>
        <h2 className="mt-1.5 font-serif text-[1.75rem] font-semibold tracking-tight">
          The rest of the collection
        </h2>
      </div>
      <FilterTabs />
    </div>

    <div className="tablet:grid-cols-2 desktop:grid-cols-3 mt-4.5 grid gap-4.5">
      {KEEPSAKE_PRODUCTS.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  </div>
);
