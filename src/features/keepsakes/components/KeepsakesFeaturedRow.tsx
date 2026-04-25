import { FeaturedProduct } from "./FeaturedProduct";
import { OrdersRail } from "./OrdersRail";

export const KeepsakesFeaturedRow = () => (
  <div className="desktop:grid-cols-[1fr_320px] grid gap-5">
    <FeaturedProduct price={389} />
    <OrdersRail />
  </div>
);
