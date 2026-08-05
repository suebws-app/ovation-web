import { containerClassName } from "@/lib/utils/layoutClassNames";
import { OrdersListSkeleton } from "../OrdersListSkeleton";

export const OrdersSkeleton = () => (
  <div className="flex w-full flex-1">
    <div className="relative flex w-full min-w-0 flex-1 flex-col">
      <div className={containerClassName}>
        <OrdersListSkeleton />
      </div>
    </div>
  </div>
);
