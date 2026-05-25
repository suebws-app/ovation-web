import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { QRCardsOrderClient } from "./QRCardsOrderClient";

export const QRCardsOrderPage = async () => {
  await requireFilledCoupleEvent();
  return <QRCardsOrderClient />;
};
