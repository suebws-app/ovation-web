import { redirect } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import { getCurrentUser } from "@/lib/auth/session";
import { analyticsApi } from "@/lib/api/analytics";
import { AnalyticsPageClient } from "./AnalyticsPageClient";

export const AnalyticsPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect(appRoutes.auth.signIn);
  if (user.planTier !== "pro_studio") redirect(appRoutes.app.events);

  const initialData = await analyticsApi.me({ range: "all" }).catch(() => null);

  return <AnalyticsPageClient initialData={initialData ?? undefined} />;
};
