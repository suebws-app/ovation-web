import { useTranslations } from "next-intl";

type FulfillmentStatusLabelProps = {
  status: string;
};

const KNOWN_STATUS_KEYS = new Set([
  "pending",
  "queued",
  "submitted",
  "in_production",
  "shipped",
  "delivered",
  "cancelled",
  "failed",
]);

export const FulfillmentStatusLabel = ({
  status,
}: FulfillmentStatusLabelProps) => {
  const t = useTranslations();
  const label = KNOWN_STATUS_KEYS.has(status)
    ? t(`orders__fulfillment__${status}`)
    : status.replace(/_/g, " ");
  return <span className="capitalize">{label}</span>;
};
