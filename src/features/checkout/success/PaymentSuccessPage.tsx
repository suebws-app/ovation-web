import { getTranslations } from "next-intl/server";
import { CheckoutSuccessRedirect } from "../CheckoutSuccessRedirect";

export const PaymentSuccessPage = async () => {
  const t = await getTranslations();
  return (
    <CheckoutSuccessRedirect message={t("checkout__success__toast_payment")} />
  );
};
