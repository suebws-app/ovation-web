import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { plansApi } from "@/lib/api/plans";
import { getCurrentUser } from "@/lib/auth/session";
import { CONSUMER_ACCOUNT_TYPE } from "@/lib/auth/account-role";
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

  if (
    user.planTier &&
    user.planTier !== "free" &&
    user.planTier !== "pro_free"
  ) {
    redirect(appRoutes.app.root);
  }

  const mode = user.accountType === "pro" ? "pro" : CONSUMER_ACCOUNT_TYPE;
  const { plans } = await plansApi.list(mode);
  const selectablePlans = plans.filter((plan) => plan.code !== "pro_free");

  return (
    <PlansBackGuard>
      <PlansPicker
        mode={mode}
        plans={selectablePlans}
        currencySelect={<CurrencySelect />}
      />
    </PlansBackGuard>
  );
};
