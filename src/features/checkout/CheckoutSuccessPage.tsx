import { CheckoutSuccessClient } from "./CheckoutSuccessClient";

type CheckoutSuccessPageProps = {
  params: Promise<{ orderId: string }>;
};

export const CheckoutSuccessPage = async ({
  params,
}: CheckoutSuccessPageProps) => {
  const { orderId } = await params;
  return <CheckoutSuccessClient orderId={orderId} />;
};
