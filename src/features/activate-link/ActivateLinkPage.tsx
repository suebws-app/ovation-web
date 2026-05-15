import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { eventsApi } from "@/lib/api/events";
import { plansApi } from "@/lib/api/plans";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { ApiError } from "@/lib/api/client";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import { ActivateLinkPicker } from "./components/ActivateLinkPicker";

export const ActivateLinkPage = async () => {
  noStore();
  const user = await getCurrentUser();
  if (user?.accountType === "pro") {
    redirect(user.planTier ? appRoutes.app.root : appRoutes.auth.signUpPlan);
  }

  const events = await eventsApi.list({ limit: 1 });
  const event = events.items[0];
  if (!event) redirect(appRoutes.app.root);

  const subResult = await subscriptionsApi.get(event.id).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });
  if (subResult?.subscription) redirect(appRoutes.app.root);

  const { plans } = await plansApi.list();
  const couplePlans = plans.filter((plan) => !plan.code.startsWith("pro_"));

  return <ActivateLinkPicker eventId={event.id} plans={couplePlans} />;
};
