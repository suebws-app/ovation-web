import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { OrdersListView } from "./OrdersListView";

export const OrdersPage = async () => {
  const t = await getTranslations();
  const user = await getCurrentUser();
  const isPro = user?.accountType === "pro";
  const title = isPro
    ? t("orders__page__title_all")
    : t("orders__page__title");
  return <OrdersListView title={title} />;
};
