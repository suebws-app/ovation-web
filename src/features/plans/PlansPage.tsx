import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { plansApi } from "@/lib/api/plans";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import { PlansPicker } from "./components/PlansPicker";
import { DreUpgradeCard } from "./components/DreUpgradeCard";
import { PlansBackGuard } from "./PlansBackGuard";
import { CurrencySelect } from "@/components/CurrencySelect";

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

  if (isUpgrade) {
    const eligible = PREMIUM_PLANS.includes(user.planTier || "");
    if (!eligible) redirect(appRoutes.app.root);
    const { plans } = await plansApi.list("addon");
    const drePlan = plans.find((plan) => plan.code === "storage_extension");
    if (!drePlan) redirect(appRoutes.app.root);
    return (
      <PlansBackGuard>
        <div className="max-w-md">
          <div className="mb-6 flex justify-end">
            <CurrencySelect />
          </div>
          <DreUpgradeCard plan={drePlan} />
        </div>
      </PlansBackGuard>
    );
  }

  if (user.planTier && user.planTier !== "free") redirect(appRoutes.app.root);

  const mode = user.accountType === "pro" ? "pro" : "couple";
  const { plans } = await plansApi.list(mode);

  return (
    <PlansBackGuard>
      <PlansPicker
        mode={mode}
        plans={plans}
        currencySelect={<CurrencySelect />}
      />
    </PlansBackGuard>
  );
};
