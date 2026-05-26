import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { appRoutes } from "@/lib/routes";
import { CreateHeader } from "@/features/layout/CreateHeader/CreateHeader";

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user?.accountType === "pro" && !user.planTier) {
    redirect(`${appRoutes.auth.plans}?as=pro`);
  }

  if (user?.accountType === "couple" && user.primaryEventId && user.onboardingComplete) {
    redirect(appRoutes.app.root);
  }

  return (
    <div className="bg-background flex min-h-screen w-full flex-col">
      <CreateHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
