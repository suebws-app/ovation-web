import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";

export default async function CreateEventGuardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user?.accountType === "pro" && !user.planTier) {
    redirect(appRoutes.auth.signUpPlan);
  }
  return <>{children}</>;
}
