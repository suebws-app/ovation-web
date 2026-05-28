import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { plansApi } from "@/lib/api/plans";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import { PlansPicker } from "./components/PlansPicker";
import { DreUpgradeCard } from "./components/DreUpgradeCard";
import { PlansBackGuard } from "./PlansBackGuard";

type PlansPageProps = {
  searchParams?: Promise<{ upgrade?: string }>;
};

const PREMIUM_PLANS = ["premium", "bundle"];

export const PlansPage = async ({ searchParams }: PlansPageProps) => {
  noStore();
  const user = await getCurrentUser();
  if (!user) redirect(appRoutes.auth.signIn);

  const params = (await searchParams) ?? {};
  const isUpgrade = params.upgrade === "1";

  const { plans } = await plansApi.list();

  if (isUpgrade) {
    const eligible = PREMIUM_PLANS.includes(user?.planTier || "");
    if (!eligible) redirect(appRoutes.app.root);
    const drePlan = plans.find((p) => p.code === "storsage_extension");
    if (!drePlan) redirect(appRoutes.app.root);
    return (
      <PlansBackGuard>
        <div className="max-w-md">
          <DreUpgradeCard plan={drePlan} />
        </div>
      </PlansBackGuard>
    );
  }

  if (user.accountType === "pro") {
    if (user.planTier && user.planTier !== "free") redirect(appRoutes.app.root);
    const proPlans = plans.filter((plan) => plan.code.startsWith("pro_"));
    return (
      <PlansBackGuard>
        <PlansPicker mode="pro" plans={proPlans} />
      </PlansBackGuard>
    );
  }

  if (user.planTier !== "free") redirect(appRoutes.app.root);

  const couplePlans = plans.filter(
    (plan) =>
      !plan.code.startsWith("pro_") &&
      plan.code !== "storage_extension" &&
      plan.code !== "essentials" &&
      plan.code !== "free",
  );
  return (
    <PlansBackGuard>
      <PlansPicker mode="couple" plans={couplePlans} />
    </PlansBackGuard>
  );
};
