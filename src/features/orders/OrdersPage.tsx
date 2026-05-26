import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { OrdersListView } from "./OrdersListView";

export const OrdersPage = async () => {
  await requireFilledCoupleEvent();
  const t = await getTranslations();
  const user = await getCurrentUser();
  const isPro = user?.accountType === "pro";
  const title = isPro
    ? t("orders__page__title_all")
    : t("orders__page__title");
  return <OrdersListView title={title} />;
};
