import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { eventsApi } from "@/lib/api/events";
import { plansApi } from "@/lib/api/plans";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { ApiError } from "@/lib/api/client";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import { PlansPicker } from "./components/PlansPicker";
import { DreUpgradeCard } from "./components/DreUpgradeCard";

type PlansPageProps = {
  searchParams?: Promise<{ upgrade?: string }>;
};

export const PlansPage = async ({ searchParams }: PlansPageProps) => {
  noStore();
  const user = await getCurrentUser();
  if (!user) redirect(appRoutes.auth.signIn);

  const params = (await searchParams) ?? {};
  const isUpgrade = params.upgrade === "1";

  const { plans } = await plansApi.list();

  if (isUpgrade) {
    const drePlan = plans.find((p) => p.code === "storage_extension");
    if (!drePlan) redirect(appRoutes.app.root);
    return (
      <div className="max-w-md">
        <DreUpgradeCard plan={drePlan} />
      </div>
    );
  }

  if (user.accountType === "pro") {
    if (user.planTier) redirect(appRoutes.app.root);
    const proPlans = plans.filter((plan) => plan.code.startsWith("pro_"));
    return <PlansPicker mode="pro" plans={proPlans} />;
  }

  const events = await eventsApi.list({ limit: 1 });
  const event = events.items[0];
  if (!event) redirect(appRoutes.app.root);

  const subResult = await subscriptionsApi.get(event.id).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });
  if (subResult?.subscription) redirect(appRoutes.app.root);

  const couplePlans = plans.filter(
    (plan) =>
      !plan.code.startsWith("pro_") &&
      plan.code !== "storage_extension" &&
      plan.code !== "essentials",
  );
  return <PlansPicker mode="couple" plans={couplePlans} eventId={event.id} />;
};
