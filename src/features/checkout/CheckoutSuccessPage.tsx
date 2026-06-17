import { getTranslations } from "next-intl/server";
import { ApiError } from "@/lib/api/client";
import { ordersApi, planPurchasesApi } from "@/lib/api/orders";
import { CheckoutSuccessRedirect } from "./CheckoutSuccessRedirect";

type CheckoutSuccessPageProps = {
  params: Promise<{ orderId: string }>;
};

const isMissing = (error: unknown) =>
  ApiError.isApiError(error) && (error.status === 404 || error.status === 403);

type CheckoutKind = "order" | "plan" | "pending";

const detectKind = async (id: string): Promise<CheckoutKind> => {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await ordersApi.get(id);
      return "order";
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
    try {
      await planPurchasesApi.get(id);
      return "plan";
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
    if (attempt < 2) await new Promise((r) => setTimeout(r, 800));
  }
  return "pending";
};

export const CheckoutSuccessPage = async ({
  params,
}: CheckoutSuccessPageProps) => {
  const { orderId } = await params;
  const t = await getTranslations();
  const kind = await detectKind(orderId);

  const message =
    kind === "plan"
      ? t("checkout__success__toast_plan")
      : kind === "order"
        ? t("checkout__success__toast_order")
        : t("checkout__success__toast_payment");

  return (
    <CheckoutSuccessRedirect message={message} clearCart={kind === "order"} />
  );
};
