import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { CartView } from "./CartView";

export const CartPage = async () => {
  await requireFilledCoupleEvent();
  return <CartView />;
};
