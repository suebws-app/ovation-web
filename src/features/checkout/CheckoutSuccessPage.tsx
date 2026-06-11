import { getTranslations } from "next-intl/server";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Logo } from "@ovation/ui/components/Logo";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { ApiError } from "@/lib/api/client";
import { ordersApi, planPurchasesApi } from "@/lib/api/orders";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { safeHttpUrl } from "@/lib/utils/safe-url";
import { translateKey } from "@/lib/utils/translateKey";
import { PlanActivatedSuccess } from "./PlanActivatedSuccess";
import { PendingOrderSuccess } from "./PendingOrderSuccess";
import {
  formatOrderDate,
  formatPrice,
  progressFor,
  statusKey,
} from "./orderHelpers";

type CheckoutSuccessPageProps = {
  params: Promise<{ orderId: string }>;
};

const isMissing = (error: unknown) =>
  ApiError.isApiError(error) && (error.status === 404 || error.status === 403);

const fetchCheckout = async (
  id: string,
): Promise<
  | { kind: "order"; result: Awaited<ReturnType<typeof ordersApi.get>> }
  | { kind: "plan"; planCode: string }
  | null
> => {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await ordersApi.get(id);
      return { kind: "order", result };
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
    try {
      const plan = await planPurchasesApi.get(id);
      return { kind: "plan", planCode: plan.purchase.planCode };
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
    if (attempt < 2) await new Promise((r) => setTimeout(r, 800));
  }
  return null;
};

export const CheckoutSuccessPage = async ({
  params,
}: CheckoutSuccessPageProps) => {
  const { orderId } = await params;
  const t = await getTranslations();
  const fetched = await fetchCheckout(orderId);

  if (!fetched) return <PendingOrderSuccess orderId={orderId} />;
  if (fetched.kind === "plan")
    return (
      <PlanActivatedSuccess orderId={orderId} planCode={fetched.planCode} />
    );
  const { order, session } = fetched.result;
  const sessionOrders = session?.orders ?? [order];
  const sessionTotalCents =
    session?.totalCents ??
    sessionOrders.reduce((sum, o) => sum + o.totalCents, 0);

  const currency = "EUR";

  return (
    <div className="bg-background min-h-screen">
      <header className="px-6 py-6">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-160 flex-col gap-6 px-6 py-10">
        <div className="rounded-20 bg-card border-border flex flex-col items-center gap-3 border p-8 text-center">
          <div className="rounded-16 bg-secondary/15 inline-flex size-16 items-center justify-center">
            <CheckIcon
              width={28}
              height={28}
              className="text-secondary"
              strokeWidth={2.5}
            />
          </div>
          <Kicker className="text-secondary mt-2">
            {t("checkout__success__eyebrow")}
          </Kicker>
          <h1 className="type-h1 leading-tight font-semibold tracking-tight">
            {t("checkout__success__title")}
          </h1>
          <p className="type-body-small text-muted-foreground max-w-md leading-relaxed">
            {t("checkout__success__body")}
          </p>
        </div>

        <div className="rounded-16 bg-card border-border border p-6">
          <div className="flex items-baseline justify-between">
            <Kicker className="text-muted-foreground">
              {t("checkout__success__order_label", {
                id: order.id.slice(0, 8),
              })}
            </Kicker>
            <span className="type-caption text-muted-foreground">
              {formatOrderDate(order.createdAt)}
            </span>
          </div>
          <p className="type-h4 mt-2 font-semibold">
            {t(statusKey(order.status))}
          </p>

          <div className="bg-border mt-3 h-1.5 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${progressFor(order.status)}%` }}
            />
          </div>

          <div className="border-border mt-5 divide-y border-t pt-3">
            {sessionOrders.map((row) => (
              <div
                key={row.id}
                className="flex items-baseline justify-between py-3"
              >
                <div>
                  <p className="type-body-small font-semibold">
                    {translateKey(t, row.productName)}
                    {row.variantName ? ` — ${row.variantName}` : ""}
                  </p>
                  <p className="type-caption text-muted-foreground">
                    {t("checkout__success__qty_unit", {
                      qty: row.quantity,
                      unit: formatPrice(row.unitPriceCents, currency),
                    })}
                  </p>
                  {row.mediaIds.length > 0 && (
                    <p className="type-caption text-muted-foreground mt-1">
                      {row.mediaIds.length} photo
                      {row.mediaIds.length === 1 ? "" : "s"} selected
                    </p>
                  )}
                </div>
                <p className="type-body-small font-mono">
                  {formatPrice(row.unitPriceCents * row.quantity, currency)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-border mt-3 flex items-baseline justify-between border-t pt-4">
            <span className="type-body-small text-muted-foreground">
              {t("checkout__success__total")}
            </span>
            <span className="type-h4 text-primary font-semibold">
              {formatPrice(sessionTotalCents, currency)}
            </span>
          </div>

          {(() => {
            const safeTrackingUrl = safeHttpUrl(order.tracking?.url);
            return safeTrackingUrl ? (
              <div className="rounded-12 bg-muted/40 mt-5 border border-dashed p-4">
                <Kicker className="text-muted-foreground">
                  {t("checkout__success__tracking")}
                </Kicker>
                <a
                  href={safeTrackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-body-small text-primary mt-1.5 block font-semibold break-all"
                >
                  {order.tracking?.carrier
                    ? `${order.tracking.carrier} · `
                    : ""}
                  {order.tracking?.number ?? safeTrackingUrl}
                </a>
              </div>
            ) : null;
          })()}
        </div>

        <div className="flex justify-center gap-2">
          <Button asChild className="rounded-full">
            <Link href={appRoutes.app.root}>
              {t("checkout__success__back_dashboard")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href={appRoutes.app.keepsakes}>
              {t("checkout__success__keep_shopping")}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};
