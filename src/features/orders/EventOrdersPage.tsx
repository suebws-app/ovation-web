import { getTranslations } from "next-intl/server";
import { OrdersListView } from "./OrdersListView";

type EventOrdersPageProps = {
  params: Promise<{ id: string }>;
};

export const EventOrdersPage = async ({ params }: EventOrdersPageProps) => {
  const { id } = await params;
  const t = await getTranslations();
  return <OrdersListView title={t("orders__page__title")} eventId={id} />;
};
