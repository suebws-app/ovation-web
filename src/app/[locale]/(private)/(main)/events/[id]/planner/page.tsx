import { redirect } from "next/navigation";
import { appRoutes } from "@/lib/routes";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(appRoutes.app.eventPlannerDashboard(id));
}
