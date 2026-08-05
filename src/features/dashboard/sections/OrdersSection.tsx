import { Orders } from "../components/widgets/Orders";
import { getRecentOrders } from "./dashboardStats";

type OrdersSectionProps = {
  eventId: string;
};

export const OrdersSection = async ({ eventId }: OrdersSectionProps) => {
  const ordersPage = await getRecentOrders(eventId);
  return <Orders orders={ordersPage?.items ?? []} />;
};
