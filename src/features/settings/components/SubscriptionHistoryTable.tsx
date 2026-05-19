import { getTranslations } from "next-intl/server";
import type { MySubscriptionHistoryItem } from "@/lib/api/types";

const formatDate = (iso: string | null, locale: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (cents: number, currency: string, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);

type SubscriptionHistoryTableProps = {
  items: MySubscriptionHistoryItem[];
  locale: string;
};

type HistoryRowProps = {
  item: MySubscriptionHistoryItem;
  locale: string;
  refundedLabel: string;
};

const HistoryRow = ({ item, locale, refundedLabel }: HistoryRowProps) => {
  const displayDate = item.paymentCompletedAt ?? item.createdAt;
  const isRefunded = item.refundedAt !== null;
  return (
    <tr>
      <td className="px-6 py-4">{formatDate(displayDate, locale)}</td>
      <td className="px-6 py-4 capitalize">
        {item.planName ?? item.planCode}
      </td>
      <td className="px-6 py-4">
        {formatAmount(item.totalCents, item.currency, locale)}
      </td>
      <td className="px-6 py-4 capitalize">
        {isRefunded ? (
          <span className="rounded-8 bg-warning/15 text-warning type-caption px-2 py-1">
            {refundedLabel}
          </span>
        ) : (
          item.status
        )}
      </td>
    </tr>
  );
};

export const SubscriptionHistoryTable = async ({
  items,
  locale,
}: SubscriptionHistoryTableProps) => {
  const t = await getTranslations();
  if (items.length === 0) return null;

  const refundedLabel = t("settings__billing__history_refunded_badge");

  return (
    <div className="flex flex-col gap-3">
      <h2 className="type-heading-small">
        {t("settings__billing__history_title")}
      </h2>
      <div className="rounded-16 border-border bg-card overflow-hidden border">
        <table className="w-full">
          <thead className="bg-muted/40">
            <tr className="text-muted-foreground type-body-small">
              <th className="px-6 py-3 text-left">
                {t("settings__billing__history_col_date")}
              </th>
              <th className="px-6 py-3 text-left">
                {t("settings__billing__history_col_plan")}
              </th>
              <th className="px-6 py-3 text-left">
                {t("settings__billing__history_col_amount")}
              </th>
              <th className="px-6 py-3 text-left">
                {t("settings__billing__history_col_status")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-border type-body divide-y">
            {items.map((item) => (
              <HistoryRow
                key={item.id}
                item={item}
                locale={locale}
                refundedLabel={refundedLabel}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
