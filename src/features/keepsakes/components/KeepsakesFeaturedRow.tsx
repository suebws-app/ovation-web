import { FeaturedProduct } from "./FeaturedProduct";
import { OrdersRail } from "./OrdersRail";

export const KeepsakesFeaturedRow = () => (
  <div className="grid gap-5 desktop:grid-cols-[1fr_320px]">
    <FeaturedProduct price={389} />
    <OrdersRail />
  </div>
);
